---
title: "DeepSeek Is Engineering Efficiency. The Frontier Labs Are Still Buying Scale."
date: 2026-08-06
source: essay
excerpt: "There are two broad ways to improve an AI model. A laboratory can develop a more efficient architecture, or it can apply more computing resources to training and inference. Every major laboratory does some of both. However, the American frontier laboratories…"
tags: ["essay"]
---

There are two broad ways to improve an AI model. A laboratory can develop a more efficient architecture, or it can apply more computing resources to training and inference. Every major laboratory does some of both. However, the American frontier laboratories have built their strategies around access to capital and computing infrastructure on a scale that few organizations can match.

Alphabet, Amazon, Meta, and Microsoft are expected to invest approximately $650 billion in AI-related infrastructure in 2026, compared with about $410 billion in 2025. OpenAI has said that its own computing expenditure could approach $50 billion this year. Anthropic has announced infrastructure agreements involving as much as five gigawatts of Amazon capacity, additional multi-gigawatt capacity developed with Google and Broadcom, and temporary access to xAI’s Colossus infrastructure under an agreement reportedly valued at as much as $1.25 billion per month.

These commitments do not mean that the companies involved have stopped conducting technical research. OpenAI and Anthropic continue to improve architectures, inference systems, tokenizers, and serving infrastructure. However, their operating model assumes that capability will continue to improve alongside unprecedented spending on data centres, chips, energy, and networking.

DeepSeek has approached the same problem from a different starting point. Its recent work does not show that compute has become unimportant. It shows what happens when reducing the amount of compute required becomes a central research objective rather than a secondary optimization.

## The Architecture Makes the Argument

DeepSeek introduced V4-Pro and a V4-Flash preview through its API on April 24, 2026. It released the production version of V4-Flash on July 31. V4-Pro contains 1.6 trillion parameters but activates approximately 49 billion for each token, which corresponds to an activation rate of about 3.1 percent. V4-Flash contains 284 billion parameters and activates 13 billion, or about 4.6 percent. Both models support context windows of up to one million tokens.

The most important figures concern inference rather than total parameter count. At a context length of one million tokens, DeepSeek reports that V4-Pro requires 27 percent of the single-token inference FLOPs and 10 percent of the KV-cache capacity required by V3.2. The architecture combines Compressed Sparse Attention, Heavily Compressed Attention, manifold-constrained hyper-connections, and a speculative decoding module. DeepSeek also trained the models on more than 32 trillion tokens using the Muon optimizer.

These are not minor serving adjustments applied after training. They address how information moves through the model, how much of the model must be activated, and how much memory long-context inference consumes. DeepSeek treated the KV cache and long-context computation as research problems and produced measurable reductions in both.

The architecture is also visible in the API pricing. DeepSeek currently lists V4-Pro at $0.435 per million uncached input tokens and $0.87 per million output tokens. OpenAI lists GPT-5.5 at standard short-context rates of $5 per million input tokens and $30 per million output tokens. At those listed rates, V4-Pro is approximately 11.5 times cheaper on input and 34.5 times cheaper on output. V4-Flash is cheaper still, at $0.14 per million input tokens and $0.28 per million output tokens. DeepSeek has also stated that it plans to increase its prices, so the current difference should not be treated as permanent.

The activation rate alone does not establish why DeepSeek selected those prices. Pricing also reflects market-entry strategy, infrastructure costs, utilization, and the laboratory’s willingness to accept lower margins. However, the architecture determines the range of prices that the company can plausibly sustain. A model that performs less computation and retains a smaller cache for each request begins with a structural cost advantage.

**DeepSeek did not negotiate a discount from the model. It reduced the amount of model that each token needs to use.**

## The Market Is Responding, but Causation Is Harder to Prove

OpenAI reduced the price of GPT-5.6 Luna by 80 percent and the price of Terra by 20 percent on July 30. Anthropic released Opus 5 at the same $5 and $25 input-and-output rates as Opus 4.8, while describing it as approaching the performance of Fable 5, which costs $10 and $50. These are substantial reductions in the price of accessing high-end capability.

It would be too strong to claim that DeepSeek directly caused each of these decisions. The companies do not disclose enough information about their pricing processes to establish that relationship. However, the changes occurred in a market where inexpensive open-weight models had become credible alternatives rather than experimental substitutes.

By June 30, OpenRouter reported that V4-Flash had been its most-used model since the middle of May and that DeepSeek models accounted for nearly 20 percent of token usage in early June. DeepSeek remained the leading provider by token share in OpenRouter’s July 13 reporting. These figures do not represent the entire AI market, but they show that developers were routing a meaningful volume of real workloads toward DeepSeek.

Ramp’s spending data points to a similar development. In June 2026, 5.8 percent of businesses purchasing AI services through Ramp were using model-serving platforms, compared with 4.5 percent in January. These companies were not simply abandoning the largest laboratories. Among businesses using model-serving platforms, 85.8 percent also paid OpenAI, 93.2 percent paid Anthropic, and 96.4 percent paid at least one of them. Advanced users were combining expensive frontier models with cheaper alternatives and assigning different workloads to each.

This evidence supports a narrower and more defensible conclusion than the original claim. DeepSeek did not single-handedly force every price reduction, but it strengthened the customer’s alternative to paying frontier-laboratory rates for every request. Once developers can route routine or high-volume tasks to a model priced below one dollar per million output tokens, the expensive provider must explain what the additional expenditure buys.

The announced Sonnet 5 pricing requires similar care. Anthropic currently charges an introductory rate of $2 per million input tokens and $10 per million output tokens. The rate will become $3 and $15 on September 1. This is not an unannounced price increase. Anthropic disclosed the expiry of the introductory discount when it launched the model. Nevertheless, the standard rate will remain substantially higher than DeepSeek’s current prices.

The market pressure is therefore real even when its precise effects cannot be assigned to one competitor. Low-cost open-weight models have changed the comparison that buyers make. The relevant question is no longer whether a model is cheaper than the previous generation from the same provider. The question is whether its additional capability justifies its price relative to models that can perform many of the same tasks at a small fraction of the cost.

## The Effort Dial Moves Part of the Efficiency Problem

Anthropic’s effort controls allow developers to adjust how much computation and how many tokens a model uses for a particular request. This is a useful feature. Some tasks require extensive reasoning, while others do not benefit from it. A fixed inference policy would either waste resources on simple requests or constrain performance on difficult ones. Anthropic’s own evaluations show different cost-performance curves at different effort settings.

However, this approach places part of the efficiency decision in the customer’s configuration. Developers must determine which requests require greater effort, establish limits, monitor token consumption, and prevent autonomous systems from repeatedly selecting expensive modes. The feature gives customers more control, but it also makes the final cost depend on application-level decisions.

DeepSeek’s architectural reductions operate at a different level. Sparse activation and compressed attention reduce the baseline resources required before the developer chooses how much reasoning to request. Anthropic’s effort controls and DeepSeek’s architectural work are therefore not opposites. They solve different parts of the same problem.

The distinction still matters. **DeepSeek reduced the baseline cost of running the model. Anthropic gave customers more control over how much of a more expensive model they consume.**

For interactive applications, that distinction may be manageable. For agentic systems that generate long chains of requests without direct supervision, it becomes more consequential. A configurable model can be efficient when its surrounding application is carefully designed. An architecturally efficient model carries part of that advantage into every request, including requests that the application handles poorly.

## Open Weights Change Who Controls Deployment

DeepSeek has released V4 checkpoints through Hugging Face. This allows organizations to inspect the weights, fine-tune the models, select their own inference providers, and operate deployments without sending every request through DeepSeek’s API.

Open weights do not make V4-Flash easy to run. A model with 284 billion total parameters still requires substantial memory, specialist infrastructure, and technical expertise. V4-Pro is beyond the practical self-hosting capacity of most individual research groups and startups. Open availability should therefore not be confused with inexpensive local deployment.

Even with those limitations, downloadable weights change the relationship between the developer and the model provider. A hospital, ministry, university, or company with adequate infrastructure can determine where the model runs, retain sensitive data within its own environment, modify the model for a specific task, and continue using a fixed version after the original provider changes its commercial service.

OpenAI’s and Anthropic’s flagship models are primarily distributed as hosted commercial products. Customers access them under provider-controlled pricing, usage policies, model-update schedules, and availability conditions. They can evaluate the outputs, but they cannot fully inspect or independently operate the underlying systems.

Open weights do not eliminate infrastructure concentration, and they do not disclose the complete training data or development process. However, they widen the set of institutions that can control their own deployments. Efficiency increases that effect because a downloadable model is useful only when organizations can realistically afford to run it.

**Efficiency is not merely a lower invoice. It determines how many institutions can participate without seeking permission from the small number of companies that own frontier-scale infrastructure.**

## The Real Difference Is the Role That Scarcity Plays

The original comparison between engineering and spending was too absolute. The American laboratories also conduct serious efficiency research. OpenAI reports that work on GPT-5.6 reduced serving costs by approximately 20 percent and improved token-generation efficiency by more than 15 percent. Its engineers are not simply purchasing more chips and waiting for capability to emerge.

The more defensible distinction concerns the role that efficiency plays in each research program. For DeepSeek, hardware and market constraints appear to have made efficiency a central architectural objective. For the largest American laboratories, efficiency remains important, but it operates within a strategy that also assumes continued access to enormous amounts of capital, energy, and computing capacity.

Export restrictions may have strengthened DeepSeek’s incentive to reduce resource requirements, but the available public evidence does not establish a direct causal relationship between a particular restriction and a particular architectural choice. The stronger conclusion does not require that causal claim. DeepSeek has demonstrated that a laboratory can compete partly by reducing how much computation its models need rather than relying only on access to more computation.

That approach now faces an important test. DeepSeek must show that its pricing is sustainable, that its models remain competitive after broader deployment, and that open-weight availability produces practical adoption rather than downloads alone. The American laboratories must show that their efficiency improvements can restrain the infrastructure and inference costs generated by increasingly large models and increasingly autonomous workloads.

The question is therefore not whether one group engineers while the other merely spends. Both groups engineer, and both groups spend.

The question is whether efficiency is treated as a primary design constraint or as an optimization within a strategy built around abundant capital. If the growth of AI infrastructure spending eventually slows, the laboratory that designed around scarcity may have more room to adapt than the laboratories whose operating models assumed that capital would remain abundant.
