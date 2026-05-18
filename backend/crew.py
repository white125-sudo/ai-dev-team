from crewai import Crew, Process
from agents import create_agents
from tasks import create_tasks


def run_crew(requirement: str, api_key: str) -> dict:
    business_analyst, architect, developer, qa_engineer = create_agents(api_key)
    ba_task, architect_task, dev_task, qa_task = create_tasks(
        requirement, business_analyst, architect, developer, qa_engineer
    )

    crew = Crew(
        agents=[business_analyst, architect, developer, qa_engineer],
        tasks=[ba_task, architect_task, dev_task, qa_task],
        process=Process.sequential,
        verbose=False,
    )

    result = crew.kickoff()

    return {
        "business_analyst": ba_task.output.raw if ba_task.output else "",
        "architect": architect_task.output.raw if architect_task.output else "",
        "developer": dev_task.output.raw if dev_task.output else "",
        "qa_engineer": qa_task.output.raw if qa_task.output else "",
    }
