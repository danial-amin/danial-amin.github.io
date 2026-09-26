---
title: "Who Gets to Decide What Makes an LLM Good?"
date: 2026-09-26
source: essay
excerpt: "Why LLM benchmarking needs to be a public endeavor"
tags: ["essay"]
---

*Why LLM benchmarking needs to be a public endeavor*

## Introduction

In my previous essay, [Do Not Trust the Benchmark](https://www.danialamin.com/writing/essays/2026-09-19-do-not-trust-the-benchmark-it-is-broken-and-it-needs-an-overhaul), I discussed several problems with how we evaluate large language models (LLMs). Some benchmarks have become saturated, others contain flawed questions, and models can sometimes exploit the evaluation procedure itself. Commercial interests also influence which results are reported and how those results are presented.

But another problem deserves attention.
---
Who decides what we evaluate in the first place?
---

We have become accustomed to seeing benchmark scores whenever a new LLM is released. Companies publish tables comparing their models against competitors, independent organizations maintain leaderboards, and researchers develop new tests to examine specific capabilities. These evaluations influence how we understand model performance and, increasingly, which models we use.

Yet most people who depend on these systems have little say in what counts as good performance.

A researcher analyzing interview transcripts, a developer maintaining an existing codebase, and a teacher preparing educational material might all use the same LLM. However, their expectations are different. A model that performs well on mathematical reasoning might struggle with qualitative analysis. Another might generate excellent code but fail to follow instructions consistently.

A general benchmark cannot adequately capture all these requirements.

I believe LLM benchmarking needs to become a public endeavor. Not because everyone should be able to score models without oversight, but because the people using these systems should have a meaningful role in determining what gets evaluated.

The questions we ask are as important as the models answering them.

## 1. Benchmarking is not merely a technical exercise

We often discuss benchmarking as a technical process. We build a dataset, set evaluation criteria, run models, calculate scores, and compare results.

But several decisions precede that process.

Someone decides which capabilities matter. Someone selects the questions, determines the expected answers, and defines what counts as success or failure. Someone also decides which limitations are acceptable and which should affect the final score.

These decisions determine what the benchmark actually measures.

Consider a benchmark for evaluating an LLM's ability to write code. Does it test whether the model can generate a function from a specification? Can it examine an existing repository, identify a bug, and modify the relevant files without breaking other functionality? Does it assess whether the model understands the user's requirements before writing code?

All three involve software development, but they are different tasks.

A model might perform well on one and poorly on another. If our benchmark concentrates on generating standalone functions, we might conclude that the model is an excellent coding assistant without knowing whether it can maintain an existing application.

The same problem exists in scientific research. Answering questions about published research is different from examining evidence, identifying unsupported claims, or maintaining consistency when analyzing a large collection of documents.

Neither capability is inherently more important. Their relevance depends on the intended use.

This is why benchmark development cannot be treated as a neutral process in which question selection is merely an implementation detail. The selection itself determines what we learn about the model.

And when a small number of organizations make these decisions, their assumptions influence how the rest of us understand LLM performance.

## 2. The people developing benchmarks do not represent every use case

Benchmark developers have expertise. That expertise is necessary to design valid tests, establish evaluation procedures, and interpret results.

However, expertise in evaluation methodology does not automatically provide knowledge of every domain in which LLMs are used.

A benchmark developed by computer science researchers may adequately assess programming or mathematical reasoning. It might not capture the requirements of a social worker, a journalist, an engineer working with technical documentation, or a researcher conducting qualitative interviews.

Even within one profession, requirements differ.

Consider two researchers using LLMs. One wants to extract information from hundreds of papers. The other wants to examine whether a generated persona contains unsupported demographic assumptions. Both are conducting research, but their evaluation criteria are not interchangeable.

The first might prioritize extraction accuracy, completeness, and correct attribution. The second might need to assess consistency, stereotyping, and whether the model introduces information that was not present in the source material.

A benchmark designed around one task cannot automatically establish performance on the other.

This is where public participation becomes useful.

People working in different fields can contribute problems based on their actual requirements. A developer can contribute tasks involving existing codebases. A researcher can contribute questions requiring evidence-based analysis. An engineer can contribute technical problems that require domain knowledge.

Such contributions can expand the range of tasks represented in a benchmark.

The purpose is not to replace evaluation researchers with the general public. It is to combine methodological expertise with the practical knowledge of people who use these systems.

A benchmark should not be limited to what its developers happen to consider important.

## 3. Public participation can help us evaluate what actually matters

The difficulty with many general benchmarks is not necessarily that they measure the wrong capabilities. They measure a limited set of capabilities and are then interpreted as broader measures of intelligence or usefulness.

A model receives a high score on a reasoning benchmark, and that score becomes part of a general claim about its capabilities.

But what does that tell me about my work?

I use LLMs for research involving personas, interview data, and how people are represented in AI systems. I need models that follow instructions, maintain consistency, handle supplied evidence, and acknowledge when information is missing.

If a model scores excellently on a mathematical benchmark but invents evidence while analyzing my data, its mathematical performance does not solve my problem.

The reverse is also true. A model that performs well on my research tasks might not be appropriate for advanced mathematical reasoning.

We therefore need to distinguish general capability evaluation from task-specific evaluation.

Public participation can help make this distinction possible. Contributors can submit questions associated with particular tasks, domains, and evaluation criteria. Instead of combining every result into a single score, we can examine performance within the categories that matter to different users.

For example, a coding benchmark could distinguish code generation, debugging, repository-level modifications, and test development. A research benchmark could distinguish information extraction, evidence verification, qualitative coding, and document analysis.

These categories would still require clear definitions and validation. Contributors might disagree about which capabilities matter or how they should be measured. That disagreement is useful information for benchmark development, not something that must automatically be hidden behind a single score.

The objective should be to understand performance in relation to the task.

## 4. Public benchmarking does not mean publishing every question

There is an important distinction between making benchmarking a public endeavor and making the entire question pool publicly accessible.

Publishing all benchmark questions and answers can introduce another problem.

Once a benchmark becomes widely available, its questions can appear in training datasets or be incorporated into model development. A model might subsequently perform well because it has encountered the questions or solutions before.

This makes it difficult to distinguish performance on an unfamiliar problem from reproducing information already encountered.

In my previous essay, I discussed contamination in SWE-bench Verified and the difficulties associated with interpreting results from publicly exposed evaluations.

Making benchmarking public should not mean abandoning safeguards against these problems.

We can make the evaluation process transparent while keeping appropriate parts of the question pool private.

The public should understand what a benchmark measures, how questions are selected, which models are evaluated, how responses are scored, and how results are calculated.

Contributors should also understand what happens to their submitted questions and how those questions are reviewed.

However, the exact questions and reference answers used in active evaluations may need to remain private.

This distinction matters because transparency and unrestricted access are not the same thing.

A benchmark can publish its methodology, evaluation code, sampling procedures, and aggregate results without exposing every active test item. Independent reviewers can also examine protected material under appropriate access arrangements.

The objective is to make the evaluation accountable without making the test itself ineffective.

## 5. Crowdsourcing is not a substitute for quality control

Public participation raises an obvious concern: what happens when people submit incorrect, ambiguous, or poorly designed questions?

This is a legitimate problem.

A question might contain an incorrect reference answer. It might require information that was never provided. It might assess several unrelated capabilities at once or reward a particular response style without establishing whether the response is correct.

A larger question pool does not automatically produce a better benchmark.

In fact, adding more poorly designed questions can make the evaluation less informative.

This is why crowdsourcing and expert review need to work together.

Contributors can provide questions based on their knowledge and experience. Reviewers can examine whether those questions are correct, sufficiently clear, relevant to the intended capability, and suitable for the proposed scoring procedure.

Questions should also be evaluated for duplication, ambiguity, difficulty, and potential contamination.

Some tasks can be assessed using deterministic tests. Others require human judgment or more elaborate evaluation procedures. The scoring method should depend on the task, not simply on what is easiest to automate.

Public participation expands the sources from which questions originate. Quality control determines whether those questions are suitable for evaluation.

Both are necessary.

We should also avoid assuming that a larger contributor base automatically represents the wider population. Participation can be uneven, and some professional, linguistic, or geographic groups may remain underrepresented.

A publicly contributed benchmark still needs to examine whose questions it includes and whose requirements it omits.

## 6. We need repeated evaluations, not isolated scores

Another limitation of benchmarking is our dependence on individual evaluation runs.

Suppose two models are evaluated using a particular sample of questions. One receives 82%, and the other receives 79%.

Does that establish that the first model will consistently perform better?

Not necessarily.

The result might depend on which questions were selected, how the models were configured, and whether their responses vary between attempts.

A different sample could produce different results.

Repeated evaluation can help us understand this variability.

Under appropriate sampling conditions, repeated attempts using different questions from a defined pool can provide a more reliable estimate of typical performance on that pool.

However, repetition alone does not establish validity.

If the questions are flawed, repeated evaluations reproduce the same underlying problem. If the scoring procedure rewards incorrect behavior, additional attempts can produce more misleading results.

We need to distinguish between reducing sampling uncertainty and correcting systematic errors.

Public contributions can help expand the range of available questions, while repeated sampling can reduce dependence on a particular selection. Neither eliminates the need for quality control.

We should also report more than an average score.

Variation between attempts, the number of evaluated questions, execution time, token usage, and cost can all affect how useful a model is for a particular task.

For someone using an LLM occasionally, a small cost difference might be irrelevant. For an organization processing thousands of documents, that difference could be substantial.

Similarly, a model that performs exceptionally well in some attempts but fails unpredictably in others might be unsuitable for a task requiring consistent behavior.

Benchmarking should provide enough information for people to make these distinctions themselves.

## 7. Independent evaluation must also be accountable

Public participation does not eliminate the need for independent evaluation.

Model developers have legitimate reasons to evaluate their own systems. They need to understand performance during development, identify weaknesses, and compare new versions against previous ones.

However, benchmark scores are also commercial assets.

A favorable result can influence purchasing decisions, investment, and public perception. This creates incentives to emphasize particular benchmarks, configurations, or evaluation conditions.

Independent evaluation provides additional evidence.

But independence is not established simply because an organization is legally separate from the model developer.

We need to understand who funds the evaluation, what access the evaluator receives, whether unfavorable results can be published, and whether the evaluator can examine the publicly available model.

Public benchmarking can contribute to accountability by letting a broader group of people help define the questions and examine the methodology.

Nevertheless, public participation and independent oversight address different problems.

A crowdsourced benchmark might have broad participation but poor methodological controls. An independent evaluator might have excellent technical expertise but limited knowledge of how a model performs in particular professional settings.

Combining these approaches can address different weaknesses.

The public contributes knowledge about relevant tasks. Evaluation researchers establish appropriate methods. Independent organizations examine performance and report findings.

No single group should have exclusive authority over what constitutes good model performance.

## 8. Benchmarking needs public infrastructure, not another leaderboard

If we accept that public participation matters, the next question is how to organize it.

Simply creating another leaderboard and allowing people to submit questions would not resolve the underlying problems.

We need infrastructure that supports contributions, review, evaluation, and public access to results.

This does not necessarily mean one centralized platform. Universities, independent research organizations, professional communities, and public institutions could maintain different benchmarks using shared methodological standards.

A researcher working on scientific reasoning might contribute to a benchmark maintained by an academic community. Software developers could contribute real-world development tasks. Professionals working in education, healthcare, or public administration could help establish the requirements relevant to their fields.

These evaluations could remain separate while following comparable reporting standards.

What matters is that the process is open to contributions beyond the organizations developing the models.

Public infrastructure also requires sustainable funding.

Running evaluations costs money. Models consume computational resources, expert review takes time, and maintaining a reliable question pool requires continuous work.

If evaluation organizations depend entirely on the companies whose models they assess, maintaining independence becomes difficult.

Public research funding, pooled contributions, institutional support, and other arrangements that protect editorial independence deserve consideration.

However, funding alone is insufficient. Evaluation organizations should disclose their financial relationships, establish clear publication rights, and document their procedures.

There is also a governance question.

Who decides which contributed questions are accepted? Who resolves disagreements about scoring? Who determines when a benchmark has become saturated or requires revision?

These decisions should follow documented procedures and involve people with relevant expertise.

Public participation should extend beyond submitting questions. Contributors should be able to report errors, challenge evaluation criteria, and identify tasks missing from existing benchmarks.

An evaluation system should be able to correct itself when its assumptions no longer hold.

The goal is not to create a single public authority that determines which LLM is best.

It is to develop an evaluation ecosystem in which different communities can examine the capabilities that matter to them, using methods that others can inspect and question.

## 9. Public access should mean more than being able to view a score

There is another distinction worth making.

A benchmark can publish its leaderboard and still provide very little meaningful transparency.

We might see that one model achieved 85% and another 82%, but know almost nothing about the questions, evaluation conditions, scoring errors, or uncertainty behind those results.

Making a score public is not the same as making the evaluation understandable.

At a minimum, public results should explain what was measured, which model version was evaluated, what configuration was used, how many questions were included, and how performance was calculated.

Where appropriate, they should also report variation, cost, execution time, and known limitations.

If a model performs poorly on a particular category of tasks, that information should remain visible even when its overall score is high.

Similarly, when a benchmark is revised, users should understand what changed and why results from different versions may not be directly comparable.

This matters because benchmark results often circulate without their original context.

A score published under one evaluation configuration can become a general claim about a model's capabilities. A result from a narrow question pool can be interpreted as evidence of broad competence.

Public access should help people examine these claims, not simply repeat them.

We should understand what a score means before using it to make decisions.

## 10. Benchmarking should be a public responsibility

As LLMs become part of education, research, software development, public services, and everyday work, their evaluation increasingly affects decisions made by people who had no involvement in developing the models or the benchmarks.

This creates a problem.

The people who depend on these systems are often expected to trust performance claims based on tasks they did not select, evaluation procedures they cannot inspect, and scores that may have little relevance to their work.

We need to change that relationship.

Public benchmarking should allow people to contribute relevant questions, examine evaluation methods, understand the limitations of reported results, and assess models against their own requirements.

It should also retain the safeguards necessary for credible evaluation: private test material where appropriate, expert review, independent oversight, repeated sampling, and reliable scoring procedures.

Making benchmarking public does not mean that every submitted question should be accepted or that every opinion should carry the same evidentiary weight.

It means that determining what we evaluate should not remain the exclusive responsibility of a small number of organizations.

The people developing models, the researchers evaluating them, and the people using them all bring different knowledge to the table.

We need all three.

The question should no longer be limited to which model achieved the highest score on a particular benchmark.

We should also ask who developed that benchmark, why they selected those questions, whose requirements they represent, and whether the results help us understand the model's actual performance.

A benchmark is useful when it measures something that matters and provides credible evidence.

The public deserves a role in deciding what that something is.
