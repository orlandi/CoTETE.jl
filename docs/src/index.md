# CoTETE.jl

*Continuous-Time Event-based Transfer Entropy*

```@meta
CurrentModule = CoTETE
```
Transfer entropy (TE) is a measure of information flow between time series. It can be used to
infer functional networks of statistical associations. Under certain assumptions it
[can also be used](https://doi.org/10.1063/1.5025050) to estimate underlying causal networks
from observational data.

This package allows one to estimate the TE between event-based time series
(such as spike trains or social media post times) in continuous time (that is, without discretising
time into bins). The advantages of this approach over the discrete-time approach include:
* The continuous-time approach is **provably consistent** - it is guaranteed to converge to the true
  value of the TE in the limit of infinite data. The discrete-time estimator is not consistent. It is easy to create examples
  where it does not converge to the true value of the TE.
* The discrete-time approach is thwarted by having an effective limit on the total number of bins
  that can be used for history embeddings. This means that the user of this approach must choose between
  capturing relationships occurring over long time intervals, or those that occurr with fine time precision
  (by choosing either a large or small bin size ``\Delta t``).
  They can never capture both simultaneously. By contrast, the continuous-time approach can capture
  relationships occurring over relatively long time intervals with **no loss of precision**.
* On synthetic examples studied, the continuous-time approach **converges orders of magnitude faster**
  than the discrete-time approach and exhibits substantially lower bias.
* In the inference of structural and functional connectivity, the discrete-time approach was typically
  coupled with a surrogate generation method which utilised an incorrect null hypothesis. The
  use of this method can be demonstrated to lead to high false-positive rates.
  CoTETE.jl contains an implementation of a method for generating surrogates which conform to the
  correct null hypothesis of conditional independence.
See [our paper](https://doi.org/10.1101/2020.06.16.154377) for more details on all of these points.

Transfer entropy has already been widely applied to the spiking activity of neurons.
Notable work on the application of TE to spike trains include:
* [The reconstruction](https://doi.org/10.1371/journal.pcbi.1002653) of the
  structural connectivity of neurons from simulated calcium imaging data.
  [See here](https://doi.org/10.1371/journal.pone.0098842) for an extension to this work.
* The inference of structural connectivity from models of spiking neural networks
  ([1](https://doi.org/10.1007/s10827-013-0443-y), [2](https://doi.org/10.1371/journal.pone.0027431)).
* [Investigation](https://doi.org/10.1371/journal.pcbi.1007226) of the energy efficiency of
  synaptic information transfer.
* The inference of functional and effective networks (
  [1](https://doi.org/10.1523/jneurosci.2177-15.2016),
  [2](https://doi.org/10.1371/journal.pone.0115764),
  [3](https://doi.org/10.1371/journal.pcbi.1004858),
  [4](https://doi.org/10.1103/PhysRevE.90.022721)
  )

CoTETE.jl contains implementations of the estimator and local permutation scheme presented in
[Estimating Transfer Entropy in Continuous Time Between Neural Spike Trains or Other
Event-Based Data](https://doi.org/10.1101/2020.06.16.154377). If you are new to information-theoretic
estimators and would like to gain an understanding of how this estimator works, I would recommend
starting with the [Background](@ref) section of this documentation.




## Contents
```@contents
Pages = ["background.md", "quickStart.md", "background", "public.md", "internals.md"]
Depth = 1
```
## Other Software
If you would like to apply TE to other data modalities, the [JIDT](https://github.com/jlizier/jidt) toolkit is highly
recommended.

## Acknowledgements
The estimator implemented here was developed in collaboration with my PhD supervisor, Joseph Lizier,
as well as Richard Spinney.
