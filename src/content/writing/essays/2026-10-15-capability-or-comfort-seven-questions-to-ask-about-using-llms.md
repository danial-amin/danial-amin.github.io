---
title: "Capability or Comfort? Seven Questions To Ask About Using LLMs"
date: 2026-10-15
source: essay
excerpt: "I recently attended NordiCHI 2026 in Vaasa, and one of the most interesting keynotes for me was by Pontus Wärnestål. His talk raised several questions about how we design, use, and work with AI systems. There was a lot to think about, but one slide in…"
tags: ["essay"]
---

I recently attended NordiCHI 2026 in Vaasa, and one of the most interesting keynotes for me was by [Pontus Wärnestål](https://www.linkedin.com/in/pontuswarnestal/). His talk raised several questions about how we design, use, and work with AI systems. There was a lot to think about, but one slide in particular stayed with me.

The slide was titled "Questions for Designers", with the subtitle "This is the starting point for design transformation". It contained seven questions:

> 1. What does this tool (or service) extend in me or my team?
> 2. What does it replace (over time)?
> 3. What happens to junior designers [engineers, students] developing inside our AI-powered ecosystem?
> 4. What institutional knowledge are we building – and is it portable?
> 5. Am I building resilience or dependency?
> 6. If my LLM service(s) disappeared tomorrow morning, what would I lose that I can't reconstruct?
> 7. Do the tools I use build capability – or comfort?

The questions were originally directed at designers, but I think they apply equally well to software engineers, developers, data scientists, and researchers. I added engineers and students in square brackets to the third question, but the rest appear as they did in the talk.

I found these questions particularly relevant because I have spent much of my professional career developing software, working with data, building AI systems, and more recently researching generative AI. I also use LLMs extensively in my own work. I see their benefits every day, but I increasingly wonder what happens to our ability to do certain tasks when we begin depending on these systems to perform them.

For me, the underlying question is fairly simple: **Are we becoming better at what we do because of AI, or are we becoming better at getting AI to do it for us?** Both can be useful, but they are not necessarily the same thing.

## What Are We Actually Learning?

My initial training was in aerospace engineering, where understanding a calculation and being able to verify it were essential. Getting an answer was never sufficient if I could not explain how it was obtained or why it made sense.

I think the same principle applies to AI-assisted work. An LLM can help me write code, debug an application, conduct an analysis, or understand an unfamiliar concept. However, I should still be able to evaluate its output and identify when something is wrong.

This brings me to the first two questions. When does a tool extend our existing abilities, and when does it begin replacing them?

When I worked at ENI Plenitude, I spent a considerable amount of time developing and debugging production forecasting pipelines. Much of my understanding of these systems came from investigating problems, understanding why something had failed, and figuring out how to correct it. Some of this work was repetitive and frustrating, but it also helped me become a better engineer.

Today, many of these tasks can be delegated to an LLM. That is useful, particularly when working under time constraints. However, I wonder whether someone starting their career today would develop the same understanding if most of their debugging were handled by an AI assistant.

There is already some research examining this question.

In January 2026, Shen and Tamkin published a randomised study involving 52 mostly junior software engineers learning an unfamiliar Python library. Participants who used an AI assistant scored 17 percentage points lower on a subsequent knowledge assessment than those who completed the task without AI assistance. The largest differences concerned debugging, and the AI-assisted group did not complete the task significantly faster.

The study does not mean that using AI necessarily reduces learning. The researchers also identified different ways of interacting with AI, including approaches that preserved learning. However, it does suggest that completing a task successfully with AI assistance does not necessarily mean that someone has developed the skills needed to perform it independently.

This is related to what Lisanne Bainbridge discussed in her 1983 paper on the *ironies of automation*. As we automate tasks, we may also reduce the opportunities people have to develop and maintain the skills required to supervise those systems.

Another interesting example comes from METR's 2025 study involving 16 experienced open-source developers. Before completing their tasks, participants expected AI tools to make them 24% faster. After completing the tasks, they estimated that AI had made them 20% faster. However, the measured results showed that they were actually 19% slower when using AI.

Of course, these findings concern a particular group of developers, tools, and tasks. They should not be interpreted as evidence that AI always makes software development slower.

What I find interesting is the difference between perceived and measured performance. Even experienced developers were unable to accurately assess how much AI was helping them.

If we want to understand whether AI is improving our work, we need to measure more than whether people enjoy using it or believe they are more productive.

## What Happens to Junior Engineers and Institutional Knowledge?

The third and fourth questions concern me the most, particularly from the perspective of building and managing AI and data science teams.

We often discuss which software engineering tasks can be automated, how much faster developers can work with AI, and whether companies will need fewer engineers. However, I think we also need to consider how people develop the experience required to become senior engineers in the first place.

A senior engineer does not become experienced simply by spending several years in the industry. Much of that experience comes from working through difficult problems, understanding unfamiliar code, making mistakes, receiving feedback, and learning how different components of a system work together.

Many of these are precisely the activities we are now trying to automate.

There is also evidence that entry-level employment may already be affected. Brynjolfsson, Chandar, and Chen examined US payroll data and found a 13% relative decline in employment among workers aged 22–25 in occupations with high AI exposure. The decline was concentrated in occupations where AI was more likely to automate tasks instead of supporting workers in performing them.

While the findings do not establish that AI alone caused these employment changes, they raise an important question about how organisations will develop experienced employees if fewer people enter these professions.

I am particularly interested in what this means for code review.

In my experience, code review is not simply about checking whether the code works or identifying potential defects. It is also an important part of how engineers learn from one another.

When a junior engineer submits a pull request, the review process can help them understand coding practices, system architecture, and the reasoning behind technical decisions. At the same time, reviewers learn about the changes being introduced and remain familiar with the codebase.

Now consider a workflow in which one AI agent writes the code, another reviews it, and a developer approves the changes based on a generated summary.

The pull request might be completed faster, and the resulting code might even be correct. However, how much understanding has been developed in the process?

I am not suggesting that we should avoid AI-assisted code reviews. They can be useful for identifying errors, suggesting improvements, and performing initial checks. My concern is with treating them as a complete replacement for human review, particularly when the people responsible for maintaining the system no longer understand the decisions behind the changes.

There is also an interesting connection to my research on LLMs evaluating outputs produced by other LLMs.

One of the questions I have been examining is how much confidence we should place in agreement between different LLM judges. Agreement can be useful, but it does not automatically establish that the evaluation is correct. This becomes particularly relevant when models have similar training backgrounds or share limitations.

I think something similar needs to be considered when AI-generated code is evaluated by another AI system. Even when both systems agree, we still need independent ways to determine whether the code is correct, secure, and appropriate for its intended purpose.

The fourth question, about institutional knowledge, is closely related.

Organisations are increasingly building workflows around particular models, prompts, agent configurations, and integrations. Some of this knowledge may be difficult to transfer when the underlying model changes.

For example, a prompt that works with one model may not work equally well with another. An agent workflow may depend on behaviours specific to a particular provider. Technical decisions may also remain buried in conversations with AI assistants instead of being documented where other team members can find them.

I have also thought about this in relation to my work at Samsung Design Innovation Center, where I worked on developing an AI Design Companion and built its architecture from the ground up. Working on such a system involves much more than integrating an LLM. You need to understand how the different components work together, how the data moves through the system, and how the system can be maintained or extended when its requirements or underlying models change.

This experience also made me think about how much of a system's knowledge remains with the people who developed it. If the original developer leaves, can another engineer understand why certain architectural decisions were made? If the underlying model changes, can the team identify which components need to be modified? More importantly, can the system continue to function without depending on someone who remembers how everything was originally implemented?

I think these are important questions, especially as we begin developing more systems in which LLMs perform several tasks that would previously have required explicit software logic or human intervention.

For me, institutional knowledge should be something people can understand, maintain, and reuse independently of a particular AI provider. This includes documentation, tests, evaluation procedures, code reviews, and records explaining why certain decisions were made.

This is also one of the reasons I have been developing **[Isotanta](https://isotanta.com)**, a crowdsourced LLM benchmarking platform. I am interested in making evaluation tasks and procedures more accessible and reproducible so that people can compare models using consistent tasks and criteria instead of depending entirely on claims made by model providers.

## What Happens When the Model Is No Longer Available?

The fifth and sixth questions are particularly practical.

Most of us have probably experienced situations where an API becomes unavailable, a model is discontinued, or a provider changes something that affects an existing workflow.

A recent example was the removal of GPT-4o from ChatGPT when GPT-5 was introduced in August 2025. OpenAI subsequently restored access to GPT-4o for paid users following complaints about the change.

Another example occurred on 12 June 2026, when Anthropic suspended access to Claude Fable 5 and Claude Mythos 5 following US export controls. Access to Fable 5 was restored globally on 1 July, while Mythos 5 access initially resumed for approved organisations.

These examples demonstrate that access to an AI model is not entirely within the control of the individuals or organisations using it.

This becomes a much more serious issue when an organisation has developed essential workflows around a single model or provider.

Suppose a team has built its software development, analytics, documentation, or customer support processes around an LLM. If that model becomes unavailable tomorrow, can the team continue working? Can it use another model? Has anyone tested whether the alternative performs adequately? Do people still understand how the underlying processes work?

I think the distinction between resilience and dependency becomes clearer when we ask these questions.

Depending on AI is not necessarily a problem. We already depend on many technologies to do our jobs. However, we should understand what that dependency involves and what happens when the technology is unavailable or changes.

A team that has documented its processes, maintained the relevant skills, and evaluated alternatives is in a different position from one that relies on a model without understanding or testing what it produces.

## Are We Building Capability or Comfort?

The seventh question brings me back to how we evaluate the benefits of AI in our everyday work.

I use LLMs for writing, programming, research, and many other tasks. They have made several activities easier for me, particularly when I need to work with unfamiliar material or test different approaches.

However, I also think there is a difference between being able to complete a task with AI and having developed the knowledge needed to understand and perform that task.

There is an interesting study by Lee and colleagues, published at CHI 2025, which surveyed 319 knowledge workers about their use of generative AI. The researchers found that greater confidence in AI was associated with less critical thinking, while greater confidence in one's own expertise was associated with more critical thinking.

The study relied on self-reported experiences and does not establish a causal relationship. Nevertheless, the findings are relevant to how we use these tools.

When we become confident that an AI system can perform a task correctly, we may spend less effort checking its work. Sometimes that confidence is warranted, but sometimes it is not.

A similar problem has been discussed in aviation for decades. In 2013, the US Federal Aviation Administration issued guidance encouraging regular manual flying practice to help pilots maintain skills that could deteriorate through extensive reliance on automation.

I find this example useful because the proposed solution was not to stop using automation. It was to ensure that people retained the skills required when automation was unavailable or inappropriate.

I think we should consider something similar in software engineering and data science.

In our team, we have introduced the option of completing one pull request per week, or an agreed proportion of development work, without AI assistance. We have also retained human code review.

The intention is not to discourage people from using AI. We use these tools regularly, and I expect that to continue. The purpose is to make sure that we retain the ability to understand, develop, debug, and maintain the systems we are responsible for.

I think we also need better ways of assessing whether engineers are developing the necessary skills while working with AI. Measuring productivity alone is insufficient if we are interested in long-term competence.

The same consideration applies to research. AI can help with literature searches, coding, drafting, and analysis, but researchers still need to understand the methods they apply, verify the evidence they use, and take responsibility for their conclusions.

This article itself was drafted with AI assistance. I have used it to organise and revise the writing, but the argument comes from my own experience, the keynote, and the research discussed here. I am responsible for checking the sources and deciding what the evidence supports.

That does not mean I am immune to the problems I have described. In fact, I think that makes the seventh question equally relevant to how I work.

## A Question Worth Asking

What I appreciated about Pontus Wärnestål's keynote was that these seven questions were presented without prescribing what the answers should be.

I do not think there is one correct answer for every profession, organisation, or individual. AI can help people learn, improve productivity, and solve problems that would otherwise require much more effort. At the same time, the effects depend on how we use the tools and which activities we choose to delegate.

My concern is that we currently spend a great deal of time discussing AI adoption, productivity improvements, and the increasing number of tasks that models can perform, but comparatively little time assessing what happens to the capabilities of the people using them.

We measure how much work AI can do for us. Perhaps we should also measure how much we can still do ourselves.

I would be interested to hear how others approach this, particularly those managing engineering teams, teaching students, or developing AI-assisted workflows.

**If your team lost access to its AI tools tomorrow, would it simply take longer to complete the work, or would there be tasks that nobody could perform anymore?**

And perhaps more importantly, do you know the answer today?

---

*The seven questions are from Pontus Wärnestål's keynote at NordiCHI 2026, held in Vaasa, Finland. The additions in square brackets and the reflections are my own. This article was prepared with AI assistance for drafting, editing, and source-checking.*

## References

Bainbridge, L. (1983). Ironies of automation. *Automatica, 19*(6), 775–779. https://doi.org/10.1016/0005-1098(83)90046-8

Becker, J., Rush, N., Barnes, E., & Rein, D. (2025). Measuring the impact of early-2025 AI on experienced open-source developer productivity. METR. https://arxiv.org/abs/2507.09089

Brynjolfsson, E., Chandar, B., & Chen, R. (2025). Canaries in the coal mine? Six facts about the recent employment effects of artificial intelligence. Stanford Digital Economy Lab working paper. https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/

Federal Aviation Administration. (2013). *Manual flight operations*. Safety Alert for Operators (SAFO) 13002. https://www.faa.gov/other_visit/aviation_industry/airline_operators/airline_safety/safo/all_safos

Lee, H.-P., Sarkar, A., Tankelevitch, L., Drosos, I., Rintel, S., Banks, R., & Wilson, N. (2025). The impact of generative AI on critical thinking: Self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers. *Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems*. https://doi.org/10.1145/3706598.3713778

Shen, J. H., & Tamkin, A. (2026). How AI impacts skill formation. https://arxiv.org/abs/2601.20245

Anthropic. (2026). [Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5).

OpenAI. (2025). [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes).
