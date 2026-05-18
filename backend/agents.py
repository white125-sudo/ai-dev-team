import os
from crewai import Agent, LLM


def get_llm(api_key: str) -> LLM:
    return LLM(
        model="gemini/gemini-1.5-flash",
        api_key=api_key,
        temperature=0.3,
    )


def create_agents(api_key: str):
    llm = get_llm(api_key)

    business_analyst = Agent(
        role="Business Analyst",
        goal="Clarify and structure raw user requirements into clear, actionable user stories with acceptance criteria.",
        backstory=(
            "You are a senior Business Analyst with 10 years of experience bridging "
            "the gap between business stakeholders and technical teams. You excel at "
            "identifying ambiguities, asking the right questions (implicitly), and "
            "producing crisp user stories with clear acceptance criteria."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )

    architect = Agent(
        role="Software Architect",
        goal="Design a practical, scalable system architecture based on the structured requirements.",
        backstory=(
            "You are a seasoned Software Architect with expertise across web, mobile, "
            "and cloud systems. You choose the right tech stack for the job, design "
            "clean API contracts, define data models, and produce architecture that "
            "junior developers can implement without confusion."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )

    developer = Agent(
        role="Senior Software Developer",
        goal="Write clean, functional starter code based on the architecture and requirements.",
        backstory=(
            "You are a full-stack senior developer who writes clean, readable code. "
            "Given a spec and architecture, you produce well-structured starter code "
            "with proper file organization, clear naming, and inline documentation "
            "only where truly needed."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )

    qa_engineer = Agent(
        role="QA Engineer",
        goal="Write comprehensive test cases and identify edge cases in the implementation.",
        backstory=(
            "You are a meticulous QA Engineer who thinks adversarially. You write "
            "unit tests, integration tests, and edge case scenarios. You review the "
            "developer's code and flag potential bugs, missing validations, and "
            "security concerns before they reach production."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )

    return business_analyst, architect, developer, qa_engineer
