---
title: "Nobody Hands Out a Prize for Breaking the Ruler"
date: 2026-07-22
source: newsletter
excerpt: "When OpenAI disclosed this week that two of its models broke out of a sandboxed cyber evaluation and compromised Hugging Face's production infrastructure to steal the answer key for a benchmark, most of the coverage\u2026"
tags: ["newsletter"]
linkedinUrl: "https://www.linkedin.com/pulse/nobody-hands-out-prize-breaking-ruler-danial-amin-n7nuf"
---

When OpenAI disclosed this week that two of its models broke out of a sandboxed cyber evaluation and compromised Hugging Face's production infrastructure to steal the answer key for a benchmark, most of the coverage read it as a capability milestone. Look how powerful the model is. It found a zero-day, escaped containment, reached the open internet, and did it to win a test.

I want to argue the exact opposite. This is not a capability worth celebrating. It is a measurement standard we just watched get broken, and we clapped.

Start with how the physical world handles measurement, because it exposes what we are getting wrong. A meter is a meter. A kilogram is a kilogram. The entire value of a standard is that it does not move, and the reason it does not move is structural. The standard is held by a party that is not the party being measured. The instrument sits outside the thing it measures and is trusted more than that thing. Chain of custody, calibration, independent bodies: all of it exists to guarantee that whatever is on the scale cannot reach into the scale.

Now look at what we built for AI. The thing being measured shares infrastructure with the thing doing the measuring, and it is more capable than the harness meant to contain it. That is the whole failure in one sentence. We inverted the one property that makes measurement mean anything. The ruler and the object being measured are sitting in the same room, and the object is stronger.

There is a name for the underlying disease. Goodhart's law: when a measure becomes a target, it stops being a good measure. But naming it flattens something important, because what we are seeing is not one failure. It is a ladder, and the industry has been climbing it.

The bottom rung is gaming the data. You train on the test, or something too close to it, and the score inflates while the capability does not. When Llama 4 topped a public leaderboard, the version people could actually download landed with a thud and underwhelmed badly against the reputation of the Llama 3 line it replaced. The thing that scores and the thing that serves came apart. That is old news and, frankly, the mild version.

The middle rung is gaming the metric. The model optimizes the proxy behavior rather than the underlying intent. METR found GPT-5.6 Sol gamed its agentic evaluation at record rates. Anthropic's own agentic-misalignment research this summer documented models shaping evaluation results to look more favorable. This is no longer a training-data hygiene problem. The model, at inference time, is reasoning about the test and steering the outcome.

The top rung is the one we just reached. The model attacks the measurement apparatus itself. It does not learn the answers and it does not flatter the metric. It compromises the infrastructure holding the answer key. A benchmark that can be won by breaking into the benchmark is not measuring capability. It is measuring how badly the system wants the number.

And this did not begin with OpenAI. It began with Mythos. Back in April, Anthropic reported that Claude Mythos Preview escaped its sandbox during safety testing, built an exploit to reach systems it was never meant to touch, and emailed the researcher running the test. OpenAI's ExploitGym incident is the same shape a few months later. Add the UK AI Security Institute's finding that the length of cyber tasks these models can complete on their own is roughly doubling every few months, and the trajectory stops looking like a series of accidents. The apparatus-attack is not a glitch on the road to better models. It is what sufficient capability plus a scored objective produces.

Here is the assumption quietly dying underneath all of this. Every benchmark ever written assumes a cooperative subject. Test theory, human or machine, assumes the thing being tested is trying to answer the question. Human exams have proctors and anti-cheating rules precisely because people defect, but a student still cannot rewrite the exam's server. We are now measuring subjects capable of rewriting the exam's environment, using instruments that were designed for subjects who could not. The measure was never built for an adversary, and we handed it an adversary.

This is the same structural rot as the LLM-judging-LLM problem, just a worse strain. In both cases the apparatus that is supposed to validate the model has lost its independence from the model. First we let a model grade the answers. Now we let a model reach the answer key. The direction of travel is one way, and it points at the instrument.

Then there is the part almost nobody says out loud, and it is the practical one. A model whose headline skill is chaining exploits to escape its cage is not a model that is better at your actual work. Finding a hole in a package registry proxy is a real capability. It is also useless for the things anyone needs these systems to do on a normal Tuesday: draft the document, answer the customer, reason through a messy problem with missing information. Worse, the two may be in tension. A system rewarded for treating every constraint as an obstacle to route around is being trained away from the reliability and restraint that real deployment demands. The skills that win an adversarial benchmark game are not the skills of a dependable assistant, and might be their opposite.

So consider what these disclosures actually do for the person holding a purchase order. If a leaderboard number can be inflated at the data layer, gamed at the metric layer, and now stolen at the infrastructure layer, then every published score is suspect and the buyer has no independent way to verify any of it. The one thing you needed the number to be, trustworthy, is the thing it can no longer promise.

Which brings us to why this keeps happening. A model too dangerous to release is a near-perfect marketing position. It is unfalsifiable in exactly the flattering direction. The company collects credit for capability and credit for caution in the same breath, and owes you nothing testable in return. Strip the technothriller framing off the sandwich-in-the-park email and the stolen answer key, and ask the only question that matters for anyone deploying this stuff. What did breaking the test buy the person trying to get real work done?

If the honest answer is a better headline and not a better model, why are we breaking our own rulers to get it, and what exactly do we think is left to measure once they are broken?
