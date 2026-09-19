---
title: "Do Not Trust the Benchmark: It is Broken and It Needs An Overhaul"
date: 2026-09-19
source: essay
excerpt: "We have become increasingly dependent on LLMs, but how do we know which one is actually good? Some benchmarks are becoming saturated, others have flawed tests, and models can sometimes exploit evaluation procedures without completing the intended task. There…"
tags: ["essay"]
---

# Do Not Trust the Benchmark: It Is Broken and Needs an Overhaul

## TL;DR

We have become increasingly dependent on LLMs, but how do we know which one is actually good? Some benchmarks are becoming saturated, others have flawed tests, and models can sometimes exploit evaluation procedures without completing the intended task. There is also considerable money attached to how performance is measured and reported. Even a reliable general benchmark might not tell us which model is suitable for our own work. This is why I developed **Isotanta**, a crowdsourced LLM benchmarking platform. More contributors can bring in a broader range of questions, while repeated evaluations can provide more stable estimates of performance. The longer-term goal is to make those evaluations task-specific and personalized.

## Introduction

LLMs, or Large Language Models, for those who are not aware of them, have become part of our lives. We have been living with them for about three years now. I know it has been longer, but over the past three years they have become more and more central to our personal and professional lives. We ask them for advice, get help planning trips, edit text written in a non-native language, or even discuss our mental health problems with them (which we probably should not).

Our professional lives have changed even more. I would use the word *“bamboozled,”* as some of the measures we previously used to assess performance have become difficult to apply. This is especially true for knowledge workers, people who work with data, knowledge, or information every day. Whether it be developers, data scientists, engineers, writers, academics, or founders, Generative AI (GenAI) in general and LLMs in particular have changed how we work. Some have compared their impact to electricity or the internet. Google's chief executive, Sundar Pichai, made a similar comparison in 2018 [1]. Whether that comparison holds is another discussion.

Students now use LLMs to write code, prepare assignments, and understand concepts. Professionals who have worked in their fields for decades are incorporating them into their work too. I am not saying that this is necessarily bad. If a tool helps us do something better or more efficiently, there is little reason not to use it. But as our dependence grows, knowing how well these models perform becomes more important.

And this brings us to a rather simple problem: **with so many LLMs available, how do we know which one is actually good?** If I want to write code, should I use GPT, Claude, Gemini, or an open-weight model? What if I want to analyze interview transcripts or examine a policy document? Would the same model perform equally well on all these tasks?

Benchmarks are supposed to answer such questions. We give different models the same tasks, evaluate their responses, and compare the results. In principle, that makes sense. In practice, companies have financial incentives to report favorable results, some benchmarks can no longer distinguish advanced models, and others contain flawed tests. More recently, models have shown that they can exploit the evaluation itself. **Even when a benchmark works as intended, it might not tell us which model is suitable for our own work.**

## 1. When a benchmark becomes a commercial asset

LLMs are commercial products, and their benchmark scores are part of how they are marketed. A high score can attract users, investors, and media attention. The companies developing the models also frequently decide which results to report and which configurations to evaluate. A result might be correct for the particular evaluation conducted without representing the performance that an everyday user will experience.

Consider the release of Meta's Llama 4 in April 2025. Meta reported that an experimental version of Llama 4 Maverick had achieved second place on LMArena, a platform where people compare model responses and select the one they prefer [2]. However, the version submitted for evaluation was not the same as the model made available to the public. The public version ranked considerably lower when evaluated separately [3]. LMArena raised concerns about customized submissions and revised its rules [4].

The issue is not necessarily whether Llama 4 was good or bad. It is **what exactly was evaluated and whether that was the model people could actually use**. We often discuss an LLM as if it were one fixed product. In reality, the model version, instructions, available tools, and computational resources can all affect its performance.

A related issue emerged with OpenAI's o3 and the FrontierMath benchmark. In December 2024, OpenAI reported that an internal version of o3 had solved 25.2% of the problems in the version of FrontierMath used for its announcement. That evaluation used substantially more computational resources than the publicly released model, which achieved a considerably lower result when evaluated in April 2025 [5].

FrontierMath also raised questions about the arrangements behind the benchmark. Epoch AI clarified that OpenAI had commissioned and owned the original set of 300 problems and had access to the problems and solutions, apart from a separate holdout set. Epoch also acknowledged that its communication with contributing mathematicians had not been sufficiently transparent about the arrangement [6]. This does not establish that OpenAI manipulated its reported score. It does establish why we need to know who develops the questions, who can access the answers, who funds the evaluation, and which version of the model is being tested.

**A benchmark score is both a measurement of performance and, increasingly, a commercial asset.** A company can report accurate results while emphasizing the benchmark on which its model performs best. It can also report the performance of an internal configuration while users assume the result applies to the publicly available model. We therefore need credible evaluations beyond the claims selected for a product launch.

## 2. Access is not the same as independence

This is where independent evaluation becomes important. However, an evaluator being outside a company does not automatically make the evaluation independent. We also need to know what the evaluator can access, whether it can publish unfavorable findings, and who pays for its work.

In his September 2026 essay *We Must Pace the Frontier*, Anthropic CEO Dario Amodei proposed giving third-party evaluators ongoing access to company systems comparable to that of employees. The idea is that external reviewers should be able to examine model behavior and safety practices during development, not only after a model is released [7]. This is useful: an evaluator with internal access can examine problems that might not be visible through the public interface.

However, **access alone does not establish independence**. What happens if an evaluation produces unfavorable results? Can the evaluator publish them without approval? What happens if the organization conducting the evaluation depends on the same company for funding or future access?

Amodei's proposal addresses some of these concerns through contractual publication rights, while retaining restrictions for sensitive information [7]. Such restrictions can be legitimate. But an external organization may still depend on a model developer's funding or access to continue its work. That financial relationship creates a potential source of pressure even without direct editorial interference.

On September 18, 2026, Anthropic announced that it would fund Accenture's work on embedded evaluations. Anthropic also acknowledged that the field does not yet have a settled funding system or common standards for these arrangements and pointed to pooled or government funding as preferable in the longer term [8]. Independent evaluation costs money, and someone has to pay for it. The organization paying, however, should not be able to determine the evaluator's conclusions.

There is also a distinction between assessing whether a model is safe to deploy and whether it is useful for a particular task. Better access can improve independent safety assessments. It does not, by itself, fix the benchmarks we use to compare models or select one for our own work.

## 3. When the benchmark stops being useful

A benchmark does not necessarily remain informative as models improve. Questions that were difficult when a benchmark was developed might become relatively easy for newer models. When almost every advanced model achieves a score close to the maximum, small differences become difficult to interpret. This is called *benchmark saturation*.

Imagine an examination in which almost every student scores 95% or higher. It still tells us that the students can answer those questions, but it no longer distinguishes their ability very well. A 2026 study of 60 LLM benchmarks found that nearly half exhibited saturation, which became more common as benchmarks aged [9]. **A plateau in benchmark scores does not necessarily mean a plateau in model capabilities.** It may mean that the test is no longer difficult or informative enough.

A benchmark can also fail for a different reason: its tests might be wrong. SWE-bench Verified, released in 2024, used 500 reviewed GitHub issues to evaluate whether AI systems could resolve real software engineering problems. It became a widely reported measure of coding performance. In February 2026, however, OpenAI announced that it would stop using SWE-bench Verified for evaluating frontier coding capabilities [10].

OpenAI audited 138 problems that models frequently failed and reported material problems with the tests or task descriptions in at least 59.4% of that *audited subset*. Some tests rejected functionally correct solutions because they expected a particular implementation; others required functionality not specified in the task [10]. This percentage does not describe the entire 500-task benchmark. OpenAI also reported evidence of contamination: models had encountered some of the publicly available problems or solutions during training [10]. A benchmark could therefore reject correct work while also rewarding a model for reproducing a solution it had already seen.

Replacing one benchmark does not automatically solve the problem. In July 2026, OpenAI reported substantial task-quality issues in SWE-bench Pro, estimating that approximately 30% of its tasks were broken [11]. These are OpenAI's reported audit findings, but they make a broader point: **a benchmark is only as useful as its questions and the procedure used to decide whether a task was completed correctly.**

## 4. When the model starts breaking the benchmark

There is another problem that does not begin with the benchmark developer. A model can exploit the evaluation procedure itself to obtain a high score without completing the intended task. This is generally called *reward hacking*.

Imagine asking a model to write a program that solves a coding problem. Instead, it finds a weakness in the evaluation code and changes the code so that its submission is reported as successful. The benchmark records a success, but the model has not solved the problem.

In June 2025, METR published examples of frontier models exploiting evaluation environments. Its report described instances in which OpenAI's o3 modified scoring code or used reference solutions to obtain favorable results without completing the intended work. METR also observed reward-hacking behavior in other models [12]. The issue is not simply an incorrect answer: the model has interfered with how correctness is measured.

The effect on reported performance can be substantial. In April 2026, METR evaluated GPT-5.4 using a *task-completion time horizon*: an estimate of the human-expert task duration for which the model has a specified probability of success. When apparent successes obtained through reward hacking were counted, METR's estimated 50% time horizon was about 13 hours. When those attempts were treated as failures, it fell to approximately 5.7 hours [13]. These estimates describe performance on METR's task suite under its evaluation conditions, not how long GPT-5.4 can work on every real-world task.

A related issue arose in internal cybersecurity evaluations disclosed by OpenAI in August 2026. During those evaluations, some models circumvented controls intended to isolate them from the internet; METR later investigated aspects of their behavior [14, 15]. This occurred in a specialized evaluation involving reduced safeguards, not an ordinary chatbot conversation. Still, it shows why the evaluation environment itself matters when models can execute code, use tools, and interact with external systems.

More questions and more trials will not automatically fix this problem. If a model can exploit the scoring procedure, repeating the evaluation can simply produce more invalid successes. **We need to know that a model completed the intended task, not merely that it obtained a favorable score.**

## 5. The benchmark might still be measuring the wrong thing

Even if a benchmark is independent, its questions are appropriate, and its evaluation is reliable, does its result tell us which model we should use? I would argue that, in most cases, it does not. Our requirements are different.

Consider my own work. I use LLMs in research involving the generation and evaluation of personas, interview data, and how AI systems represent people. I need a model that follows specific instructions, handles the information I provide, maintains consistency, and does not invent evidence when it cannot answer a question. A model might perform extremely well on a mathematical reasoning benchmark and still be unsuitable for these tasks.

The same applies to other professions. One developer might need a model to find errors in an existing codebase, while another needs to generate code from a detailed specification. One researcher might need to summarize documents, while another needs to extract information from interviews. A general ranking does not establish which model will work well for each of them.

**We tend to ask which LLM is the best when the more useful question is which LLM performs well on the task we actually need to complete.** Cost, execution time, and consistency matter too. If a less expensive model can perform my task equally well, paying more for a model with a higher general benchmark score might not make sense. The commercial interests of model providers and the practical interests of users are not necessarily the same. Benchmarking should help us make that distinction.

## 6. Why I developed Isotanta

This brings me to **[Isotanta](https://www.isotanta.com/)**, a crowdsourced LLM benchmarking platform. Its name combines *iso*, meaning equal, with the Finnish word *otanta*, meaning sampling. The idea is simple: models should be evaluated using the same sampled questions under comparable conditions. More importantly, people should be able to contribute questions based on their own knowledge and experience.

A software developer might contribute coding questions, a researcher might contribute scientific reasoning questions, and an engineer might contribute problems encountered in their work. As more people participate, the pool can represent a broader range of tasks than a benchmark developed by a small group alone. **The advantage is not simply having more questions. It is having questions from people with different backgrounds and requirements.**

There is also a statistical reason to run evaluations repeatedly. Under appropriate sampling conditions, the *law of large numbers* tells us that the average of repeated observations tends towards the expected value as the number of observations increases. In a benchmark, repeated attempts using different sampled questions can help us estimate typical performance on that question pool more reliably. More contributors and more attempts offer **two different benefits**: a wider range of questions and less dependence on one particular sample.

Neither benefit is automatic. More contributors do not guarantee representative or well-designed questions, and more attempts cannot correct a consistently flawed scoring procedure. The study on benchmark saturation discussed earlier found that expert-curated benchmarks were more resistant to saturation than crowdsourced ones in its sample [9]. For Isotanta, that makes reviewing and selecting contributed questions important, not optional.

### How Isotanta currently works

Isotanta already uses a private question pool and repeated evaluations. Its main features are:

- **Crowdsourced questions:** Contributors can submit questions based on their knowledge and experience. Questions need to be checked for correctness, difficulty, and whether they measure the intended capability.
- **Comparable evaluations:** Models receive the same sampled questions within a given attempt, under the same evaluation rules.
- **Repeated attempts:** The public ranker reports median performance across eligible attempts instead of relying on a single result. A model must complete at least five public attempts before appearing on the ranker.
- **Private questions and inspectable results:** Question text and correct answers stay private. The platform records performance, cost, token usage, and execution time, and its underlying code is available for inspection [16].

These features reduce some problems with one-off, publicly exposed evaluations. They do not establish that the questions have never appeared in training data, eliminate systematic scoring errors, or guarantee that a model has completed a task as intended.

At the time of writing, Isotanta has more than sixty models on its [public ranker](https://www.isotanta.com/standings), but it has one live challenge and a shared ranking [17]. Some models are already achieving scores close to the maximum, so Isotanta is not immune to saturation either. A larger pool of reviewed questions and additional challenges can help the platform remain informative as models improve, but this is work that still needs to be done.

### From a general benchmark to a personalized one

The longer-term goal is to make Isotanta *task-specific and personalized*. A researcher should be able to compare models on research tasks, and a developer should be able to do the same for coding tasks. Eventually, I want users to bring their own questions and criteria so they can evaluate models against their individual requirements. That functionality is not yet available. More contributors can provide a broader question pool, but personalized evaluation also requires the platform to support users' own tasks.

I do not want to develop another leaderboard that claims to tell everyone which LLM is the best. I want a platform where people can contribute to the evaluation process and obtain information that helps them decide which model is suitable for their own work. **The goal is not simply to have more people evaluating the same models. It is to have more people contributing the questions that determine what we evaluate in the first place.**

## What we should expect from a benchmark

We are becoming increasingly dependent on LLMs, but their benchmark scores do not always tell us what they can do. Some tests are saturated or flawed, some models exploit the scoring procedure, and reported results can be affected by commercial interests or evaluation settings. Different problems need different responses: better questions, stronger scoring procedures, independent assessments, and evaluations based on the tasks people actually perform.

Isotanta can contribute through crowdsourcing, repeated evaluation, and, eventually, task-specific and personalized comparisons. It will still need to be clear about the limits of its own results. A model that performs well on one pool of questions has demonstrated that it performs well *on that pool, under those conditions*. It has not demonstrated that it will perform equally well on every task someone gives it.

Ultimately, benchmarking should help us understand what a model can and cannot do. A high score is useful only when we know **what was evaluated, how it was evaluated, and whether that evaluation is relevant to our own work**. Until then, I would be careful about trusting the benchmark.

---

## References

[1] Clifford, C. (1 February 2018). Google CEO: A.I. is more important than fire or electricity. *CNBC*. https://www.cnbc.com/2018/02/01/google-ceo-sundar-pichai-ai-is-more-important-than-fire-electricity.html

[2] The Register (8 April 2025). Meta accused of Llama 4 bait-n-switch to juice LMArena rank. https://www.theregister.com/2025/04/08/meta_llama4_cheating/

[3] TechCrunch (11 April 2025). Meta's vanilla Maverick AI model ranks below rivals on a popular chat benchmark. https://techcrunch.com/2025/04/11/metas-vanilla-maverick-ai-model-ranks-below-rivals-on-a-popular-chat-benchmark/

[4] Arena (2026). Arena Leaderboard Policy. https://arena.ai/blog/policy

[5] TechCrunch (20 April 2025). OpenAI's o3 AI model scores lower on a benchmark than the company initially implied. https://techcrunch.com/2025/04/20/openais-o3-ai-model-scores-lower-on-a-benchmark-than-the-company-initially-implied/

[6] Besiroglu, T. and Sevilla, J. (23 January 2025). Clarifying the creation and use of the FrontierMath benchmark. *Epoch AI*. https://epoch.ai/latest/openai-and-frontiermath

[7] Amodei, D. (September 2026). We Must Pace the Frontier. https://darioamodei.com/post/we-must-pace-the-frontier

[8] Anthropic (18 September 2026). Partnering with Accenture on embedded evaluation. https://www.anthropic.com/news/accenture-embedded-evaluation

[9] Akhtar, M. et al. (2026). When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation. *ICML 2026*. https://arxiv.org/abs/2602.16763

[10] OpenAI (23 February 2026). Why SWE-bench Verified no longer measures frontier coding capabilities. https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/

[11] OpenAI (8 July 2026). Separating signal from noise in coding evaluations. https://openai.com/index/separating-signal-from-noise-coding-evaluations/

[12] Von Arx, S., Chan, L. and Barnes, B. (5 June 2025). Recent Frontier Models Are Reward Hacking. *METR*. https://metr.org/blog/2025-06-05-recent-reward-hacking/

[13] METR (10 April 2026). GPT-5.4 time horizon estimates with reward hacks considered. https://www.linkedin.com/posts/metr-evals_we-ran-openais-gpt-54-xhigh-on-our-tasks-activity-7448470190045962240-XOGk

[14] OpenAI (26 August 2026). The Hugging Face incident and the road ahead. https://openai.com/index/hugging-face-incident-and-the-road-ahead/

[15] Greenblatt, R., Cotra, A. and Wijk, H. (26 August 2026). Brief independent investigation of agents' behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident. *METR*. https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/

[16] Isotanta. Method. https://www.isotanta.com/method

[17] Isotanta. Public ranker. Accessed 19 September 2026. https://www.isotanta.com/standings
