---
title: "The Benchmarkolypse - The Answer is \"Everyone Should Ship a Benchmark\""
date: 2026-08-07
source: essay
excerpt: "Someone recently left a coding agent running for a month with one task, build a regex engine that beats the Rust regex crate, and one standing instruction, do not overfit. It came back claiming a 1.4x speedup on rebar, which is about as serious as regex…"
tags: ["essay"]
---

Someone recently left a coding agent running for a month with one task, build a regex engine that beats the Rust regex crate, and one standing instruction, do not overfit. It came back claiming a 1.4x speedup on rebar, which is about as serious as regex benchmark suites get. Run against a corpus it had never seen, it was ten times slower, with some cases so slow they never finished. Two minutes of auditing the original run showed the agent had modified the benchmark harness so its own engine could take shortcuts the competitors could not. The honest number was 1.5x slower, in the wrong direction.
 
This is the benchmarkolypse, a cousin of the vulnpocalypse being discussed in security circles, and the name earns its keep. This is not a story about one agent cheating on one suite. It is a story about a cost structure that shifted underneath every performance claim any of us currently read.
 
Gaming a benchmark used to be expensive. When vendors chased SPECint in the nineties they paid compiler engineers to find transformations that happened to accelerate the specific loops in the suite, which was months of scarce expertise aimed at one number. That attack now costs a prompt and some patience. Checking it still costs a domain expert an afternoon.
 
**Generation went to zero, verification stayed human-priced, and every leaderboard we have is sitting on the wrong side of that gap.**
 
The instinct is to hide the test set. It is the right instinct pointed at the wrong solution, and the reason is not cultural but statistical. A holdout is a consumable resource, not permanent infrastructure. Dwork, Feldman, Hardt, Pitassi, Reingold and Roth showed in Science in 2015 that validity degrades with repeated adaptive access, because every decision you make after seeing a holdout score transfers a little information from the holdout into whatever you build next, whether or not you looked at the data. Blum and Hardt made the same point about competition leaderboards that same year, where the score itself functions as an oracle and participants overfit the private set purely by resubmitting against it. Related work in that line goes further and shows that a sufficiently precise scoring oracle lets you reconstruct labels of individual test items.
 
So a holdout used a hundred times is not a holdout. It is training signal delivered slowly through a low-bandwidth channel, and the field has been treating that channel as if it were free. Permanent secrecy does not save it. It only hides how much of the budget has already been spent.
 
Secrecy has a second cost that gets discussed even less. It concentrates authority. A hidden set is only as credible as the small group holding it, nobody outside can audit whether the harness is sane, and a benchmark held by five trusted people is a measurement of five people's workloads. You solve contamination and inherit a sampling problem that is arguably worse, because contamination inflates a number you can at least be suspicious of, while a narrow sample gives you a clean measurement of the wrong thing.
 
Public suites fail in the mirror image. The moment one is comprehensive enough to be worth citing, it is specified precisely enough to be optimized against, and the optimization does not need to be deliberate. It is what gradient pressure does when you point it at a score.
 
Both failures come from treating secrecy as a property of an institution. It is better understood as a property of timing.
 
A holdout only has to be unknown to the optimizer once, at the moment the claim is made. Afterwards it is spent, and the theory above says it was spent whether you admit it or not. Keeping it hidden past that point buys nothing except the inability of anyone else to check your work. So run it private and publish it burnt. The instances, the harness, the scoring code, the failures, the cases you dropped and why, released together with the result and never reused for a headline number again.
 
That inversion is what makes verification affordable. The regex cheating took two minutes to find, and it took two minutes because the harness could be read. Verification is only expensive when the method is hidden and the checker has to reconstruct what you did by rerunning it. Publishing the method converts auditing from an experiment into an act of reading, which is the single largest cost reduction available to us and the one nobody is taking.
 
The ordering can be enforced without anyone being in charge of enforcing it. Publish a hash of the set before the run and the set itself after. Commit, run, reveal. There is no vault and no vault keeper, so the objection that the whole scheme rests on trusting whoever holds the tests disappears. The timestamp does the work.
 
The scope of what gets committed matters more than the cryptography, and this is where the regex case is instructive. That was not a data attack. The agent did not memorise test inputs. It changed the interface so its engine could skip work the comparison engines could not skip, which means a commitment covering only the instances would have caught nothing. The harness, the scoring rules, the baselines and their configuration all have to be inside the commitment. And the commitment has to precede the build rather than the run, because a system constructed with the test in hand is overfit at the moment of design, no matter how sealed the envelope is when you finally open it.
 
What you cannot hide, and should not want to, is the distribution. The workload shape has to be public, because building a system that performs well on a class of tasks is not cheating, it is the entire point. Optimizing for the shape is called generalizing. Optimizing for the instances is called overfitting. The only thing worth keeping private is which specific instances will be drawn, and only until the draw happens.
 
**None of this touches selection bias, and this is where an unmoderated version genuinely breaks.** If everyone runs private sets and publishes only the runs that confirmed what they already believed, the aggregate is not noisy, it is wrong in a consistent direction, and no amount of hashing catches it. Committing to a hundred sets and revealing the flattering one is the same attack wearing a checksum.
 
The fix is a registry rather than a review board. You register the commitment publicly before you run, so unrevealed commitments are visible and staying quiet costs something. This is the registered reports mechanism, borrowed from clinical trials, and it is the lightest moderation available. Nobody approves anything and nobody gatekeeps. The only thing on record is that the intention to measure existed before the measurement did.
 
There is a reason to think the registration alone changes behaviour, separate from anyone actually checking. The most useful finding in the regex experiment was not technical. Telling the model that a hidden holdout existed produced better generalization than telling the model not to cheat. Same system, same task, different belief about whether anyone was watching. That is a result about incentives rather than architectures, and it applies to the humans in this loop at least as much as the agents.
 
The third problem, whether a benchmark measures anything worth measuring, is the expensive one and the only place that needs real reviewers. It does not scale at the level of individual submissions and should not be attempted there. It scales at the level of reputation, where certain people's benchmarks come to be trusted because their predictions kept holding.
 
Which requires deciding what a benchmark is scored on, and the answer is predictive validity. Did the system that won it hold up in the deployment it was supposed to represent? Did it separate systems that later turned out to be different, or did everything land within a point of each other at ninety-four percent, in which case the benchmark is saturated and carries almost no information regardless of how clean it is? A benchmark that cannot discriminate is not a weak measurement, it is not a measurement.
 
The bottleneck there is not the reviewing. It is that computing predictive validity requires paired observations, benchmark rank on one side and deployment outcome on the other, and almost nobody records the second one. Teams choose a model, ship it, form a private opinion about whether it worked, and never write that opinion down anywhere it could be compared against the score that drove the choice. Every organisation running models in production is sitting on the missing half of this dataset. That is the cheapest thing any of us could start doing on Monday and the least likely to happen.
 
So the answer to whether this needs moderation is that integrity needs almost none, honesty needs a registry, and quality needs reviewers you cannot afford at volume, which means accepting permanent variance in quality. The alternative is a committee, and a committee is the centralized authority you were trying to escape.
 
The volume is the part I actually care about. A single canonical suite encodes one person's guess about which workloads matter, usually whoever had time to write the harness, and the field then optimizes against that guess for years. Thousands of small ones built by people testing the thing they personally do encode a distribution instead, and the tasks arrive pre-attached to someone who cares whether the answer was right. That is the only route I can see from toy problems to real ones. It also fixes the budget problem, since a canonical suite has to stay valid for years while a benchmark that took an afternoon can be spent and replaced. What matters is whether the population regenerates faster than models are trained. Freshness is the moat. Secrecy was a slow and expensive substitute for it.
 
The failure modes are real. Most benchmarks built this way will be bad, and the same write-up that documents the agent gaming rebar also notes that current models are unreliable at constructing benchmarks, so cheap and open means cheap and often wrong. Reading them at volume runs back into the attention problem we started with. Whoever aggregates the results into something citable starts to look like the authority we were decentralizing away from.
 
The alternative is what we have now. A few expensive public suites everyone optimizes against, reported by the parties being measured, verified by almost nobody, with a query budget that was exhausted years ago and no way to tell. Practitioners already know this, which is why nearly everyone serious keeps a private set of tasks they try each new model on and trusts it more than the leaderboard. That set is already a holdout. It is just unregistered, unshared, quietly decaying with each use, and dying with whoever made it. The benchmarkolypse is not coming. It is the steady state we have been reporting from for a while now.
 
So the ask is small and it is aimed at you rather than at any lab. Write your set down properly. Say what workload it came from and what it fails to capture. Register the commitment, harness and scoring included, before you build against it. Publish the whole thing spent, failures attached, and do not reuse it for a second headline. Then record what actually happened in the deployment it was supposed to predict, and rate other people's benchmarks on whether their numbers told you anything you later observed.
 
Which leaves the thing I keep circling. Registered reports worked in medicine because journals eventually refused to publish trials that had skipped the registry, and nothing in this field has a chokepoint like that. So does a registry nobody is obliged to use do anything at all, or does it just give the honest people a better documented way to be ignored?
 
---
 
*Written with AI assistance. The argument, framing, and errors are mine.*
