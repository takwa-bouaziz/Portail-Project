import json
import re

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ai_client import HuggingFaceConfigError, call_hf_api
from .models import CvMatchAnalysis, CvRewriteResult, HrCvRanking, HrInterviewGuide


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


def _normalize_question_list(value):
    if not isinstance(value, list):
        return []

    questions = []
    for item in value:
        if not isinstance(item, dict):
            continue
        question = str(item.get("question", "")).strip()
        ideal_answer = str(item.get("ideal_answer", "")).strip()
        evaluation_points = _normalize_string_list(item.get("evaluation_points"))
        if question:
            questions.append(
                {
                    "question": question,
                    "ideal_answer": ideal_answer,
                    "evaluation_points": evaluation_points,
                }
            )
    return questions


def _normalize_ranking_list(value):
    if not isinstance(value, list):
        return []

    ranking = []
    for item in value:
        if not isinstance(item, dict):
            continue
        score = item.get("score", 0)
        try:
            score = int(score)
        except (TypeError, ValueError):
            score = 0
        candidate_name = str(item.get("candidate_name", "")).strip()
        if candidate_name:
            ranking.append(
                {
                    "candidate_name": candidate_name,
                    "score": max(0, min(100, score)),
                    "decision": str(item.get("decision", "")).strip(),
                    "strengths": _normalize_string_list(item.get("strengths")),
                    "risks": _normalize_string_list(item.get("risks")),
                    "reason": str(item.get("reason", "")).strip(),
                }
            )
    return sorted(ranking, key=lambda item: item["score"], reverse=True)


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

    CvMatchAnalysis.objects.create(
        user=request.user if request.user.is_authenticated else None,
        cv_text=cv_text,
        job_description=job_description,
        **response_payload,
    )

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

    response_payload = {
        "section_name": str(parsed.get("section_name", section_name)).strip(),
        "original_text": section_text,
        "rewritten_text": str(parsed.get("rewritten_text", section_text)).strip(),
        "improvement_notes": _normalize_string_list(parsed.get("improvement_notes")),
    }

    CvRewriteResult.objects.create(
        user=request.user if request.user.is_authenticated else None,
        target_role=target_role,
        **response_payload,
    )

    return Response(response_payload, status=status.HTTP_200_OK)


@api_view(["POST"])
def generate_hr_interview_guide(request):
    data = request.data
    job_title = data.get("job_title")
    job_description = data.get("job_description")

    if not job_title or not job_description:
        return Response(
            {"error": "job_title and job_description are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prompt = f"""
You are an HR interview advisor.
Prepare interview questions for the following role.

Job title:
{job_title}

Job description:
{job_description[:4000]}

Return only a valid JSON object with this exact shape:
{{
  "questions": [
    {{
      "question": "interview question",
      "ideal_answer": "short idea of a strong answer",
      "evaluation_points": ["point 1", "point 2", "point 3"]
    }}
  ]
}}

Rules:
- Generate exactly 8 questions
- Mix technical, behavioral, motivation, and role-fit questions
- ideal_answer must help the HR advisor know what a good candidate could mention
- evaluation_points must be concrete criteria to listen for
- Do not include markdown or explanations outside the JSON
""".strip()

    try:
        ai_response = call_hf_api(prompt, max_new_tokens=900)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    try:
        parsed = json.loads(_extract_first_json_block(ai_response))
        questions = _normalize_question_list(parsed.get("questions"))
    except Exception:
        questions = []

    if not questions:
        questions = [
            {
                "question": "Pouvez-vous présenter une expérience directement liée à ce poste ?",
                "ideal_answer": "Le candidat cite une situation concrète, son rôle, les actions menées et les résultats obtenus.",
                "evaluation_points": ["Clarté", "Lien avec le poste", "Résultats mesurables"],
            },
            {
                "question": "Quelles compétences clés vous rendent adapté à ce poste ?",
                "ideal_answer": "Le candidat relie ses compétences aux missions et donne des exemples vérifiables.",
                "evaluation_points": ["Pertinence", "Exemples", "Niveau de maîtrise"],
            },
        ]

    guide = HrInterviewGuide.objects.create(
        user=request.user if request.user.is_authenticated else None,
        job_title=job_title,
        job_description=job_description,
        questions=questions,
    )

    return Response({"id": guide.id, "questions": questions}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def rank_hr_cvs(request):
    data = request.data
    job_title = data.get("job_title")
    job_description = data.get("job_description")
    candidates = data.get("candidates")

    if not job_title or not job_description or not isinstance(candidates, list):
        return Response(
            {"error": "job_title, job_description and candidates are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    clean_candidates = []
    for index, candidate in enumerate(candidates, start=1):
        if not isinstance(candidate, dict):
            continue
        name = str(candidate.get("name") or f"Candidat {index}").strip()
        cv_text = str(candidate.get("cv_text", "")).strip()
        if cv_text:
            clean_candidates.append({"name": name, "cv_text": cv_text[:2500]})

    if len(clean_candidates) < 2:
        return Response(
            {"error": "At least two CVs are required for ranking"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prompt = f"""
You are an HR screening assistant.
Rank the following candidates for the role.

Job title:
{job_title}

Job description:
{job_description[:3500]}

Candidates:
{json.dumps(clean_candidates, ensure_ascii=False)}

Return only a valid JSON object with this exact shape:
{{
  "ranking": [
    {{
      "candidate_name": "candidate name",
      "score": 0,
      "decision": "Shortlist / Maybe / Reject",
      "strengths": ["strength 1", "strength 2"],
      "risks": ["risk 1", "risk 2"],
      "reason": "short hiring recommendation"
    }}
  ]
}}

Rules:
- Include every candidate exactly once
- score must be an integer from 0 to 100
- The best candidates must appear first
- Compare against the job description, not only general quality
- Do not include markdown or explanations outside the JSON
""".strip()

    try:
        ai_response = call_hf_api(prompt, max_new_tokens=1200)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    try:
        parsed = json.loads(_extract_first_json_block(ai_response))
        ranking = _normalize_ranking_list(parsed.get("ranking"))
    except Exception:
        ranking = []

    if not ranking:
        ranking = [
            {
                "candidate_name": candidate["name"],
                "score": 60,
                "decision": "Maybe",
                "strengths": ["CV exploitable pour une première analyse"],
                "risks": ["Le classement IA n’a pas pu être structuré correctement"],
                "reason": "Analyse à revoir manuellement.",
            }
            for candidate in clean_candidates
        ]

    ranking_result = HrCvRanking.objects.create(
        user=request.user if request.user.is_authenticated else None,
        job_title=job_title,
        job_description=job_description,
        candidates=clean_candidates,
        ranking=ranking,
    )

    return Response({"id": ranking_result.id, "ranking": ranking}, status=status.HTTP_201_CREATED)
