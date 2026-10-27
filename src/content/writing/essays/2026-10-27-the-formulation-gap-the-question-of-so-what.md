---
title: "The Formulation Gap: The Question of ''So What?''"
date: 2026-10-27
source: essay
excerpt: "Oct 27, 2026"
tags: ["essay"]
---

Oct 27, 2026 

On 6 October 2026, OpenAI released [722 mathematics manuscripts](https://aiweekly.co/alerts/openai-posts-700-maths-preprints-online-mathematicians-are-up-in-arms-18014) on GitHub, reporting progress on 372 open problems. The manuscripts were produced by an unreleased internal model that had been applied to approximately 4,000 problems. One month earlier, the company announced that a system of [around 10,000 coordinated agents](https://openai.com/index/navier-stokes-solution/) had resolved the Navier–Stokes existence and smoothness problem, one of the Millennium Prize Problems.

My response to both announcements was to ask a question that I now ask of most work I encounter, whether as a reviewer for HCI conferences and journals, as a researcher, or as someone who builds AI products: what is the significance of this result? I do not intend the question as a dismissal, since several of these results are formally verified and may well be correct. The question concerns what the problems were for, who needed them solved, and what was learned in the process of solving them.

In this article I argue that the cost of producing solutions has fallen sharply, whereas the cost of formulating problems worth solving has remained the same. Research, product development, and much of what is presented as progress in AI increasingly optimise for the former while giving little attention to the latter.

## Tame and wicked problems

Rittel and Webber (1973) distinguished between tame and wicked problems. A tame problem has a clear goal, a definitive formulation, and a criterion that indicates when it has been solved; a chess endgame and a mathematical theorem are typical examples. A wicked problem lacks these properties. It has no definitive formulation, because understanding the problem and developing a solution proceed together, and it has no stopping rule, so work on it ends when time, resources, or patience run out rather than when a solution is reached.

The solutions to wicked problems can only be judged as better or worse, and never as true or false. Each wicked problem is also essentially unique and may itself be a symptom of another problem. Rittel and Webber summarised these properties by observing that the formulation of a wicked problem is the problem.

Many of the problems that matter outside formal mathematics are wicked in this sense. Examples include ensuring fairness in welfare allocation, determining whether a persona adequately represents the population it describes, and deciding what a product should do for users who cannot clearly articulate their needs.

This distinction helps to explain the pattern of recent progress in AI. Large language models perform best on problems that have a stopping rule, because a stopping rule makes outputs verifiable and therefore usable as a training signal. Proofs can be checked in Lean, code can be run against tests, and benchmarks have answer keys. As a result, capability has advanced first on tame problems. Wicked problems have not become easier to solve, but there is a growing risk that they are treated as though they were tame.

## Formulation is contested even in mathematics

Mathematics is the field in which problems are most clearly tame, and one might therefore expect questions of formulation to matter least there. The reception of OpenAI's release suggests otherwise. Alvaro Lozano-Robledo of the University of Connecticut [questioned why anyone would want hundreds of problems solved and released at the same time](https://aiweekly.co/alerts/openai-posts-722-ai-maths-preprints-mathematicians-balk). A statement from a group of mathematicians calling for a boycott argued that ["mathematicians did not ask for this work to be done"](https://mezha.ua/en/news/mathematicians-urge-end-to-openai-collaboration-315962/amp/) and called for a return to science centred on human understanding.

The release also raised questions of correctness. Only 162 of the 722 manuscripts had their main results formalised in Lean, and three were withdrawn within a day after a sign error was found. However, the central objection from mathematicians concerned the purpose of the work rather than its accuracy, and that objection would hold even if every proof were correct.

The Navier–Stokes case illustrates a related issue. According to [Science](https://www.science.org/content/article/how-ai-math-breakthrough-ignited-controversy), OpenAI chose Navier–Stokes because it appeared to be the most promising target, and its chief research officer estimated the cost of the effort in the millions of dollars. This suggests that tractability, rather than significance, guided the choice of problem.

Much of the path to the result was also established by others. Tristan Buckmaster and Levent Alpöge had worked on the problem for about a year, and on 15 August they [proved finite-time blow-up for the Euler equations](https://www.scientificamerican.com/article/ai-may-have-just-solved-a-million-dollar-math-problem-the-field-will-never-be-the-same/), the inviscid counterpart of Navier–Stokes. OpenAI's system completed the remaining step from that point.

The subsequent public dispute focused on credit. A less discussed consequence is the loss of what extended engagement with a problem usually produces in addition to the answer, including failed approaches, related questions, and an understanding of which version of the problem was worth pursuing.

It should also be noted that OpenAI's construction concerns the variant of the problem with a [smooth external force](https://arxiv.org/pdf/2609.17642), and that the Clay Mathematics Institute [continues to list the problem as open](https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_existence_and_smoothness). The claim has therefore not yet been accepted by the field.

If the purpose of solved problems is disputed in a field where verification is mechanical, the difficulty is likely to be greater in fields where it is not.

## The same pattern in research, frontier laboratories, and industry

I see this pattern in each of the three settings in which I work.

In HCI research, I regularly review papers that begin from a wicked problem, such as trust in AI, accessibility, or bias in generated personas, and then study a simplified version of it through a laboratory task, a crowdsourced sample, or a metric selected mainly because it is easy to compute. These studies are often methodologically sound, but their connection to the motivating problem is weak, and their findings therefore answer questions that matter mainly within the paper itself.

Frontier AI laboratories show a similar pattern at a larger scale. Problems are selected because they can be solved, and progress is reported as the number of problems solved. Such a count is a tame measure applied to a question that is itself wicked, namely what mathematics, or science more broadly, is for.

In industry, product teams frequently ship features that satisfy a clear criterion, such as working reliably, demonstrating well, or increasing usage, without first formulating the problem the feature is meant to address. The justification for the feature is then constructed after it has been built.

In all three settings, the underlying difficulty lies in allowing the capacity to produce solutions to determine which problems receive attention. When solving is expensive, its cost compels careful decisions about what to work on. When solving becomes inexpensive, that discipline has to come from somewhere else.

## My own practice

Language models play a substantial role in my own research. In my work on persona evaluation, they serve as generators, as evaluators, and as analytical tools, and I do not argue against these uses. The distinction I maintain is that I use models to solve and evaluate problems within a formulation I have developed, but I do not delegate the formulation itself.

Deciding what the problem is, whom it affects, what would constitute an adequate answer, and when to stop remains my responsibility. Models can generate plausible problem formulations on request, but a formulation represents a commitment about what matters, and researchers remain accountable for that commitment. This is a deliberate choice on my part. In my view, research that delegates formulation risks producing answers to questions for which no one has taken responsibility.

## Conclusion

If this argument is correct, the question of significance becomes a central research skill rather than a reviewer's objection. It is the question that determines whether a solved problem constitutes a contribution and whether a shipped feature constitutes a useful product.

This skill is developed largely through sustained engagement with problems, including the experience of discovering that an initial formulation was wrong. If that engagement is increasingly bypassed, it is unclear how future researchers will acquire the skill.

This raises a question that I cannot yet answer. If machines take over the work of solving, will formulation remain a distinctly human contribution to research, or will it simply become the next task to be automated?

---

## Sources

1. Rittel, H. W. J., & Webber, M. M. (1973). Dilemmas in a general theory of planning. *Policy Sciences*, 4(2), 155–169.
2. [OpenAI: On the Navier–Stokes Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/)
3. [Science: How an AI math breakthrough ignited a controversy](https://www.science.org/content/article/how-ai-math-breakthrough-ignited-controversy)
4. [Scientific American: AI may have just solved a million-dollar math problem](https://www.scientificamerican.com/article/ai-may-have-just-solved-a-million-dollar-math-problem-the-field-will-never-be-the-same/)
5. [arXiv 2609.17642: GD1998 Navier–Stokes solution revisited (describes the forced construction)](https://arxiv.org/pdf/2609.17642)
6. [Wikipedia: Navier–Stokes existence and smoothness (Clay status)](https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_existence_and_smoothness)
7. [AI Weekly, summarising Nature: OpenAI posts 722 AI maths preprints](https://aiweekly.co/alerts/openai-posts-700-maths-preprints-online-mathematicians-are-up-in-arms-18014)
8. [AI Weekly: mathematicians' reactions](https://aiweekly.co/alerts/openai-posts-722-ai-maths-preprints-mathematicians-balk)
9. [Mezha: mathematicians call for boycott of OpenAI](https://mezha.ua/en/news/mathematicians-urge-end-to-openai-collaboration-315962/amp/)
