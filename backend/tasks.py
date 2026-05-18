from crewai import Task


def create_tasks(requirement: str, business_analyst, architect, developer, qa_engineer):

    ba_task = Task(
        description=(
            f"Analyze the following requirement and produce structured user stories:\n\n"
            f"REQUIREMENT: {requirement}\n\n"
            f"Produce:\n"
            f"1. A brief problem statement (2-3 sentences)\n"
            f"2. 3-5 user stories in 'As a [user], I want [goal], so that [benefit]' format\n"
            f"3. Acceptance criteria for each user story\n"
            f"4. Any assumptions made\n"
            f"5. Out of scope items (things NOT included)\n"
        ),
        expected_output=(
            "A structured requirements document with problem statement, user stories, "
            "acceptance criteria, assumptions, and out-of-scope items."
        ),
        agent=business_analyst,
    )

    architect_task = Task(
        description=(
            f"Based on the requirements below, design a practical system architecture.\n\n"
            f"ORIGINAL REQUIREMENT: {requirement}\n\n"
            f"Use the BA's analysis as context.\n\n"
            f"Produce:\n"
            f"1. Recommended tech stack with brief justification for each choice\n"
            f"2. System components and their responsibilities\n"
            f"3. API endpoints (method, path, request/response shape)\n"
            f"4. Data models / database schema\n"
            f"5. A Mermaid diagram of the system architecture (use ```mermaid code block)\n"
        ),
        expected_output=(
            "A system architecture document with tech stack, components, API design, "
            "data models, and a Mermaid architecture diagram."
        ),
        agent=architect,
        context=[ba_task],
    )

    dev_task = Task(
        description=(
            f"Write starter code for the following requirement based on the architecture designed.\n\n"
            f"ORIGINAL REQUIREMENT: {requirement}\n\n"
            f"Use the architect's design as your spec.\n\n"
            f"Produce:\n"
            f"1. Project folder structure\n"
            f"2. Key configuration files (package.json / requirements.txt / etc.)\n"
            f"3. Core implementation files — backend API and frontend main component\n"
            f"4. A brief setup guide (how to run locally in 3-5 steps)\n\n"
            f"Format all code in proper markdown code blocks with language tags."
        ),
        expected_output=(
            "Starter code including project structure, config files, core implementation, "
            "and a local setup guide."
        ),
        agent=developer,
        context=[ba_task, architect_task],
    )

    qa_task = Task(
        description=(
            f"Review the implementation and write test cases.\n\n"
            f"ORIGINAL REQUIREMENT: {requirement}\n\n"
            f"Produce:\n"
            f"1. Unit test cases for core business logic (with code)\n"
            f"2. API integration test cases\n"
            f"3. Edge cases to watch out for\n"
            f"4. Security concerns in this implementation\n"
            f"5. A QA checklist before going to production\n\n"
            f"Format test code in proper markdown code blocks."
        ),
        expected_output=(
            "Test cases (unit + integration), edge cases, security concerns, "
            "and a pre-production QA checklist."
        ),
        agent=qa_engineer,
        context=[ba_task, architect_task, dev_task],
    )

    return ba_task, architect_task, dev_task, qa_task
