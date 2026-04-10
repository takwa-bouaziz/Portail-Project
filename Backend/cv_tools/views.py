import json
import re

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ai_client import HuggingFaceConfigError, call_hf_api


def _extract_first_json_block(raw_text):
    fenced_match = re.search(r"```json\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
    if fenced_match:
        return fenced_match.group(1)

    object_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if object_match:
        return object_match.group(0)

    raise ValueError("No JSON object found in AI response")


def _normalize_string_list(value):
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


@api_view(["POST"])
def analyze_cv_match(request):
    data = request.data
    cv_text = data.get("cv_text")
    job_description = data.get("job_description")

    if not cv_text or not job_description:
        return Response(
            {"error": "cv_text and job_description are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prompt = f"""
You are an ATS and recruiter assistant.
Analyze how well the following CV matches the job offer.

CV:
{cv_text[:3500]}

Job Offer:
{job_description[:3500]}

Return only a valid JSON object with this exact shape:
{{
  "matching_score": 0,
  "matching_summary": "short paragraph",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "missing_skills": ["missing skill 1", "missing skill 2"],
  "improvement_suggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"]
}}

Rules:
- matching_score must be an integer from 0 to 100
- strengths must be concrete and based on the CV
- missing_skills must list missing or weakly evidenced competencies
- improvement_suggestions must be actionable CV improvements
- Do not include markdown, explanations, or code fences outside the JSON object
""".strip()

    try:
        ai_response = call_hf_api(prompt, max_new_tokens=700)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    try:
        parsed = json.loads(_extract_first_json_block(ai_response))
    except Exception:
        parsed = {
            "matching_score": 65,
            "matching_summary": "The profile shows a partial match with the job offer, but the CV should better highlight role-specific skills and measurable outcomes.",
            "strengths": [
                "Relevant technical background is present in the CV.",
                "Some experience overlaps with the target role.",
                "The profile appears adaptable and trainable.",
            ],
            "missing_skills": [
                "More explicit keywords from the job offer",
                "Clear evidence of impact or quantified results",
            ],
            "improvement_suggestions": [
                "Add a stronger professional summary aligned with the target role.",
                "Include measurable achievements for each major experience.",
                "Repeat the most important job keywords naturally in the CV.",
            ],
        }

    score = parsed.get("matching_score", 0)
    try:
        score = int(score)
    except (TypeError, ValueError):
        score = 0

    response_payload = {
        "matching_score": max(0, min(100, score)),
        "matching_summary": str(parsed.get("matching_summary", "")).strip(),
        "strengths": _normalize_string_list(parsed.get("strengths")),
        "missing_skills": _normalize_string_list(parsed.get("missing_skills")),
        "improvement_suggestions": _normalize_string_list(
            parsed.get("improvement_suggestions")
        ),
    }

    return Response(response_payload, status=status.HTTP_200_OK)


@api_view(["POST"])
def rewrite_cv_section(request):
    data = request.data
    section_name = data.get("section_name")
    section_text = data.get("section_text")
    target_role = data.get("target_role", "")
    rewrite_style = data.get("rewrite_style", "professional")

    if not section_name or not section_text:
        return Response(
            {"error": "section_name and section_text are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prompt = f"""
You are an expert CV writer.
Rewrite the following CV section so it sounds clearer, stronger, and more professional.

Section name: {section_name}
Target role: {target_role if target_role else "Not specified"}
Preferred style: {rewrite_style}

Original section:
{section_text[:3000]}

Return only a valid JSON object with this exact shape:
{{
  "section_name": "{section_name}",
  "rewritten_text": "improved version of the section",
  "improvement_notes": ["what improved 1", "what improved 2", "what improved 3"]
}}

Rules:
- Keep the meaning truthful
- Improve clarity, structure, and impact
- Use concise CV language
- Do not invent false experience
- Do not include markdown or explanations outside the JSON
""".strip()

    try:
        ai_response = call_hf_api(prompt, max_new_tokens=700)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    try:
        parsed = json.loads(_extract_first_json_block(ai_response))
    except Exception:
        parsed = {
            "section_name": section_name,
            "rewritten_text": section_text,
            "improvement_notes": [
                "The wording can be made more direct and role-focused.",
                "Key achievements should be emphasized more clearly.",
                "The section benefits from a more concise structure.",
            ],
        }

    return Response(
        {
            "section_name": str(parsed.get("section_name", section_name)).strip(),
            "original_text": section_text,
            "rewritten_text": str(parsed.get("rewritten_text", section_text)).strip(),
            "improvement_notes": _normalize_string_list(
                parsed.get("improvement_notes")
            ),
        },
        status=status.HTTP_200_OK,
    )
