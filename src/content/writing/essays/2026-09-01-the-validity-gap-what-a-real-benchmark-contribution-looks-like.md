---
title: "The Validity Gap - What a Real Benchmark Contribution Looks Like"
date: 2026-09-01
source: essay
excerpt: "A team of twenty-nine reviewers recently went through 445 LLM benchmarks drawn from the proceedings of the main NLP and machine learning conferences. Sixteen percent of them used a statistical test when comparing results. About half claimed to measure…"
tags: ["evaluations", "benchmarks", "llms", "ai4good"]
---

A team of twenty-nine reviewers recently went through 445 LLM benchmarks drawn from the proceedings of the main NLP and machine learning conferences. Sixteen percent of them used a statistical test when comparing results. About half claimed to measure something like reasoning, helpfulness or safety without defining what that phenomenon was or how it would be recognised. Around a quarter built their task sets out of whatever data happened to be available.

That is the state of the field. Not a shortage of benchmarks, a surplus of them, most unable to carry the claims that get stacked on top.

Which is awkward for anyone who has argued that more of us should be shipping benchmarks, and I have. The obvious objection is that volume is the disease rather than the cure. The objection is wrong, but it is wrong for one specific reason, and that reason is the whole of what follows.

**The scarce resource in evaluation was never the test items. It is the evidence that a test measured anything.**

Items are free now. Any of us can write five hundred plausible questions in an afternoon and a model can write fifty thousand overnight. What none of us can produce cheaply is the argument that a score on those items tells you something you did not already know. That argument is the contribution. It is also the one part of this field that does not require a frontier training run or the compute to sweep it, which makes it the rare place where a practitioner with a real workload has an advantage over a lab with a cluster.

So what does contributing actually look like.

It starts with saying what you are measuring and, harder, what you are not. If your benchmark is named for agentic reasoning or cultural sensitivity, you have written down an aspiration rather than a construct. The useful version names the workload the tasks came from, the population of situations they sample, and the conditions under which the score should be ignored. A narrow benchmark with an honest scope statement is worth more than a broad one with a vague title, because the narrow one can be wrong in a way somebody is able to detect. Half the reviewed literature skipped this step, and it is the cheapest step there is.

Then there is discrimination, which almost nobody reports. Akhtar and colleagues analysed sixty widely used benchmarks this year and found that twenty-nine showed high or very high saturation, meaning the scores of the leading systems had compressed to the point where the ranking no longer carried information. When the top five models land within a point of each other, the suite is not measuring a hard problem. It is not measuring. Their other finding is the one worth sitting with, since keeping the test data private turned out to offer no protection against this at all. This is all computable. You can report whether your benchmark separated the systems you ran it on, with an uncertainty interval attached, and if it did not, you can say so and retire it. **A benchmark that cannot discriminate is not a weak measurement, it is not a measurement.**

The third piece is the one I keep coming back to, because it is simultaneously the most valuable and the least likely to happen. Predictive validity requires paired observations. You need the benchmark rank on one side and the deployment outcome on the other, and the field has an enormous quantity of the first and almost none of the second. Every team that picked a model on the strength of a score, shipped it, and then formed a private opinion about whether it actually worked is holding the missing half of that dataset. Writing that opinion down next to the score that drove the decision costs an hour. It has no publication value, carries some reputational risk, and would do more for evaluation than another leaderboard.

There is also a set of contributions that involves building nothing at all. Auditing an existing suite is the clearest one, and it demonstrably works. A manual screening of SWE-bench found that a large share of the issues the leading agents had resolved either contained the fix somewhere in the issue report or passed tests too weak to reject a wrong patch, and filtering those cut the measured resolution rates roughly in half. A separate audit of the τ-bench airline domain found errors in twenty-four of its fifty tasks, flawed ground truth and ambiguous specifications, after which the maintainers shipped more than seventy task fixes and regraded the affected leaderboard submissions. Neither of those required a lab. They required domain knowledge and the patience to read the tasks. Deprecating your own benchmark is another such contribution. So is publishing the run where the model you expected to win did not.

None of this is blocked by capability, which is the uncomfortable part. It is blocked by the fact that benchmarks are infrastructure produced as side projects and consumed as headlines. BIG-bench demonstrated that collective construction works, 204 tasks contributed by 450 authors across 132 institutions, and it also demonstrated the failure mode, since each task was written and reviewed independently and the quality varied accordingly. SuperGLUE was beaten at the human baseline inside eighteen months of release. Benchmarks do not usually die of bad design. They die of saturation and neglect, and nobody's incentives point at maintenance.

The structural fix, if there is one, is to make the benchmark itself the object of evaluation rather than the model. Not through a committee, which reintroduces the centralised authority the whole exercise is trying to avoid, but through the accumulation of a record. Whose benchmarks kept predicting what people later observed. Whose separated systems that turned out to be different. Whose numbers stopped meaning anything within a year and were quietly cited anyway.

That record is buildable today by anyone willing to publish the second half of their own data. It requires no new institution and no funding, only the willingness to be evaluated on the thing you claimed rather than on the fact that you claimed it.

So the question I would put to anyone thinking about contributing here. Would you still publish your benchmark if you knew you would be judged, two years out, on whether the systems that won it held up in production?

---

**References**

Bean, A. M., Kearns, R. O., Hafner, F. S., Rocher, L., et al. (2025). Measuring what Matters: Construct Validity in Large Language Model Benchmarks. NeurIPS 2025 Datasets and Benchmarks Track. arXiv:2511.04703. Systematic review of 445 benchmarks by 29 expert reviewers. Sixteen percent used statistical tests when comparing results, around 27 percent used convenience sampling, and roughly half of the reviewed articles worked from missing or contested definitions of the phenomenon being measured.

Akhtar, M., Reuel, A., Soni, P., et al. (2026). When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation. ICML 2026, PMLR 306. arXiv:2602.16763. Sixty benchmarks analysed, 29 with high or very high saturation and 14 in the very high category. The paper also reports that public versus private test data showed no protective effect against saturation.

Aleithan, R., Xue, H., Mohajer, M. M., Nnorom, E., Uddin, G., Wang, S. (2024). SWE-Bench+: Enhanced Coding Benchmark for LLMs. arXiv:2410.06992. Manual screening of issues resolved by the top three leaderboard agents. Solution leakage and weak tests account for a large fraction of successful patches, and filtering them drops average resolution rates from 42.1 to 21.8 percent on SWE-Bench Lite and from 51.7 to 25.9 percent on SWE-Bench Verified.

Cuadron, A., Yu, P., Liu, Y., Gupta, A. (2025). SABER: Small Actions, Big Errors, Safeguarding Mutating Steps in LLM Agents. arXiv:2512.07850. Identifies errors in 24 of the 50 original τ-bench airline tasks. The τ²-bench maintainers subsequently released more than 70 task quality fixes and regraded affected leaderboard submissions.

Srivastava, A., et al. (2022). Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models. arXiv:2206.04615. BIG-bench, 204 tasks contributed by 450 authors across 132 institutions, each written and reviewed independently. The paper also notes that superhuman performance on SuperGLUE arrived less than 18 months after its release.

Dwork, C., Feldman, V., Hardt, M., Pitassi, T., Reingold, O., Roth, A. (2015). The reusable holdout: Preserving validity in adaptive data analysis. Science, 349(6248). The formal result behind the claim that a holdout has a budget rather than a lifetime.
