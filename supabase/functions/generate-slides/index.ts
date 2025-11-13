import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestData {
  topic: string;
  slideCount: number;
  audience: string;
  presenter: string;
  designation: string;
  tone: string;
  language: string;
  tags: string;
  notes: string;
  includeImages: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RequestData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the AI prompt
    const systemPrompt = `You are an expert presentation designer and content creator. Generate professional PowerPoint presentations based on user requirements. Always return valid JSON in the exact format specified.`;

    const userPrompt = `Create a ${requestData.slideCount}-slide PowerPoint presentation with the following details:

Topic: ${requestData.topic}
Audience: ${requestData.audience || 'General audience'}
Presenter: ${requestData.presenter || 'Not specified'}
${requestData.designation ? `Designation: ${requestData.designation}` : ''}
Tone: ${requestData.tone}
Language: ${requestData.language}
${requestData.tags ? `Keywords: ${requestData.tags}` : ''}
${requestData.notes ? `Additional notes: ${requestData.notes}` : ''}
${requestData.includeImages ? 'Include image suggestions for each slide.' : 'No image suggestions needed.'}

Return a JSON object with this EXACT structure:
{
  "metadata": {
    "topic": "${requestData.topic}",
    "slide_count": ${requestData.slideCount},
    "audience": "${requestData.audience}",
    "presenter": "${requestData.presenter}",
    "tone": "${requestData.tone}",
    "language": "${requestData.language}",
    "date_generated": "${new Date().toISOString()}"
  },
  "slides": [
    {
      "index": 1,
      "title": "Title of first slide",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "speaker_notes": "Notes for the presenter",
      "duration_minutes": 1,
      "layout_hint": "title-slide",
      ${requestData.includeImages ? '"image_suggestion": "Description of suggested image"' : ''}
    }
  ],
  "palette": {
    "primary": "#1E40AF",
    "secondary": "#14B8A6",
    "accent": "#F97316"
  },
  "summary": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"]
}

Guidelines:
1. First slide should be a title slide with the presentation title and presenter info
2. Last slide should be a closing/thank you slide
3. Each slide should have 3-6 bullet points
4. Speaker notes should be 2-4 sentences
5. Layout hints: "title-slide", "content", "two-column", "image-focus", "conclusion"
6. Duration should be realistic (1-3 minutes per slide typically)
7. Color palette should be professional and harmonious (use hex codes)
8. Summary should capture 3-5 key takeaways from the entire presentation
9. Ensure content matches the specified tone and is appropriate for the audience
10. All text should be in ${requestData.language}`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.');
      }
      
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    // Parse the JSON response
    let presentationData;
    try {
      presentationData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('Invalid JSON format from AI. Please try again.');
    }

    // Validate the structure
    if (!presentationData.metadata || !presentationData.slides || !Array.isArray(presentationData.slides)) {
      throw new Error('Invalid presentation data structure');
    }

    console.log(`Successfully generated presentation with ${presentationData.slides.length} slides`);

    return new Response(
      JSON.stringify(presentationData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-slides function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
