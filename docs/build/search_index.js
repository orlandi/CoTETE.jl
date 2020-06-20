var documenterSearchIndex = {"docs":
[{"location":"#Base-Functions-1","page":"Base Functions","title":"Base Functions","text":"","category":"section"},{"location":"#","page":"Base Functions","title":"Base Functions","text":"CurrentModule = CoTETE","category":"page"},{"location":"#","page":"Base Functions","title":"Base Functions","text":"calculate_TE_from_event_times","category":"page"},{"location":"#CoTETE.calculate_TE_from_event_times","page":"Base Functions","title":"CoTETE.calculate_TE_from_event_times","text":"function calculate_TE_from_event_times(\n    target_events::Array{<:AbstractFloat},\n    source_events::Array{<:AbstractFloat},\n    l_x::Integer,\n    l_y::Integer;\n    auto_find_start_and_num_events::Bool = true,\n    start_event::Integer = 1,\n    num_target_events::Integer = length(target_events) - start_event,\n    num_samples_ratio::AbstractFloat = 1.0,\n    k_global::Integer = 5,\n    conditioning_events::Array{<:AbstractFloat} = [0.0],\n    l_z::Integer = 0,\n    metric::Metric = Euclidean(),\n    is_surrogate::Bool = false,\n    surrogate_num_samples_ratio::AbstractFloat = 1.0,\n    k_perm::Integer = 5,\n    )\n\nEstimates the TE from lists of raw event times.\n\nExamples\n\nThis example demonstrates estimating the TE between uncoupled homogeneous Poisson processes. This is covered in section II A of [1]. We first create the source and target processes, each with 10 000 events and with rate 1, before running the estimator.\n\njulia> source = sort(1e4*rand(Int(1e4)));\n\njulia> target = sort(1e4*rand(Int(1e4)));\n\njulia> using CoTETE\n\njulia> TE = CoTETE.calculate_TE_from_event_times(target, source, 1, 1)\n0.0\n\njulia> abs(TE - 0) < 0.02 # For Doctesting purposes\ntrue\n\n\nWe can also try increasing the length of the target and source history embeddings\n\njulia> TE = CoTETE.calculate_TE_from_event_times(target, source, 3, 3)\n0.0\n\njulia> abs(TE - 0) < 0.1 # For Doctesting purposes\ntrue\n\n\nLet's try some other options\n\njulia> using Distances: Cityblock\n\njulia> TE = CoTETE.calculate_TE_from_event_times(target, source, 1, 1, k_global = 3,\n                                                 auto_find_start_and_num_events = false,\n                                                 metric = Cityblock())\n0.0\n\njulia> abs(TE - 0) < 0.1 # For Doctesting purposes\ntrue\n\n\nThe next example applies the estimator to a more complex problem, specifically, the process described as example B in [2]. The application of the estimator to this example is covered in section II B of [1]. We create the source process as before. Howevever, the target process is originally created as an homogeneous Poisson process with rate 10, before a thinning algorithm is applied to it, in order to provide the dependence on the source.\n\njulia> source = sort(1e4*rand(Int(1e4)));\njulia> target = sort(1e4*rand(Int(1e5)));\njulia> function thin_target(source, target, target_rate)\n           # Remove target events occurring before first source\n    \t   start_index = 1\n    \t   while target[start_index] < source[1]\n           \t start_index += 1\n    \t   end\n    \t   target = target[start_index:end]\n\n\t   new_target = Float64[]\n    \t   index_of_last_source = 1\n    \t   for event in target\n               while index_of_last_source < length(source) && source[index_of_last_source + 1] < event\n               \t     index_of_last_source += 1\n               end\n               distance_to_last_source = event - source[index_of_last_source]\n               λ = 0.5 + 5exp(-50(distance_to_last_source - 0.5)^2) - 5exp(-50(-0.5)^2)\n               if rand() < λ/target_rate\n               \t  push!(new_target, event)\n               end\n           end\n    \t   return new_target\n       end\njulia> target = thin_target(source, target, 10);\njulia> TE = CoTETE.calculate_TE_from_event_times(target, source, 1, 1)\n0.5076\n\njulia> abs(TE - 0.5076) < 0.05 # For Doctesting purposes\ntrue\n\nWe can also try extending the length of the target embeddings in order to better resolve this dependency\n\njulia> TE = CoTETE.calculate_TE_from_event_times(target, source, 3, 1)\n0.5076\n\njulia> abs(TE - 0.5076) < 0.05 # For Doctesting purposes\ntrue\n\nArguments\n\ntarget_events::Array{<:AbstractFloat}: A list of the raw event times in the target process. Corresponds to X in [1].\nsource_events::Array{<:AbstractFloat}: A list of the raw event times in the source. Corresponds to Y in [1].\nl_x::Integer: The number of intervals in the target process to use in the history embeddings. Corresponds to l_X in [1].\nl_y::Integer: The number of intervals in the source process to use in the history embeddings. Corresponds to l_Y in [1].\nauto_find_start_and_num_events::Bool = true: When set to true, the start event will be set to the first event for which there are sufficient preceding events in all processes such that the embeddings can be constructed. The number of target events will be set such that all time between this first event and the last target event is included.\nstart_event::Integer = 1: only used when auto_find_start_and_num_events = false. The index of the event in the target process from which to start the analysis.\nnum_target_events::Integer = length(target_events) - start_event: only used when auto_find_start_and_num_events = false. The TE will be calculated on the time series from the timestamp of the start_event-th event of the target process to the timestamp of the start_event + num_target_events-th event of the target process.\nnum_samples_ratio::AbstractFloat = 1.0: Controls the number of samples used to estimate the probability density of histories unconditional of the occurrence of events in the target process. This number of samples will be num_samples_ratio * num_target_events. Corresponds to N_UN_X in [1].\nk_global::Integer = 5: The number of nearest neighbours to consider in initial searches.\nconditioning_events::Array{<:AbstractFloat} = [0.0]: A list of the raw event times in the target process. Corresponds to Z_1 in [1].\ninfo: Single conditioning process\nNote that the framework developed in out paper [1] considers an arbitrary number of extra conditioning processes, at present the framework can only handle a single such process. This will change in future releases.\nl_z::Integer = 0: The number of intervals in the single conditioning process to use in the history embeddings. Corresponds to l_Z_1 in [1].\nmetric::Metric = Euclidean(): The metric to use for nearest neighbour and radius searches.\nis_surrogate::Bool = false: If set to true, after the embeddings have been constructed, but before the TE is estimated, the source embeddings are permuted according to our local permutation scheme.\nsurrogate_num_samples_ratio::AbstractFloat = 1.0: Controls the number of samples used to to construct the alternate set of history embeddings used by our local permutation scheme. This number of samples will be surrogate_num_samples_ratio * num_target_events. Corresponds to N_U textrmsurrogateN_X in [1].\nk_perm::Integer = 5: The number of neighbouring source embeddings from which to randomly select a replacement embedding in the local permutation scheme.\n\n[1] Shorten, D. P., Spinney, R. E., Lizier, J.T. (2020). Estimating Transfer Entropy in Continuous Time Between Neural Spike Trains or Other Event-Based Data. bioRxiv 2020.06.16.154377.\n\n[2] Spinney, R. E., Prokopenko, M., & Lizier, J. T. (2017). Transfer entropy in continuous time, with applications to jump and neural spiking processes. Physical Review E, 95(3), 032319.\n\n\n\n\n\n","category":"function"}]
}
