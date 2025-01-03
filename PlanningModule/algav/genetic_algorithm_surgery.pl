:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic surgery/3.

% Sample surgeries
% surgery(ID, Duration, Priority).
surgery(s1, 2, 1).
surgery(s2, 3, 2).
surgery(s3, 1, 1).
surgery(s4, 4, 3).
surgery(s5, 2, 2).

% Initialize parameters
initialize :-
    write('Number of generations: '), read(NG), assertz(generations(NG)),
    write('Population size: '), read(PS), assertz(population(PS)),
    write('Probability of crossover (%): '), read(PC), assertz(prob_crossover(PC / 100)),
    write('Probability of mutation (%): '), read(PM), assertz(prob_mutation(PM / 100)).

% Generate initial population
generate_population(Population) :-
    population(Size),
    findall(S, surgery(S, _, _), Surgeries),
    findall(Ind, (between(1, Size, _), random_permutation(Surgeries, Ind)), Population).

% Evaluate fitness of a schedule
evaluate_schedule(Schedule, Fitness) :-
    calculate_finish_time(Schedule, 0, Fitness).

calculate_finish_time([], Time, Time).
calculate_finish_time([Surgery | Rest], CurrentTime, FinishTime) :-
    surgery(Surgery, Duration, _),
    NewTime is CurrentTime + Duration,
    calculate_finish_time(Rest, NewTime, FinishTime).

% Select individuals for the next generation
select_individuals(Population, Selected) :-
    sort(2, @=<, Population, Sorted),
    population(Size),
    length(Selected, Size),
    append(Selected, _, Sorted).

% Perform crossover
crossover(Parent1, Parent2, Child1, Child2) :-
    prob_crossover(PC),
    random(0.0, 1.0, R),
    (R =< PC -> order_crossover(Parent1, Parent2, Child1, Child2) ;
               Child1 = Parent1, Child2 = Parent2).

order_crossover(P1, P2, C1, C2) :-
    length(P1, L),
    random(1, L, Cut1), random(Cut1, L, Cut2),
    sublist(P1, Cut1, Cut2, SubP1),
    subtract(P2, SubP1, RestP2),
    append(SubP1, RestP2, C1),
    sublist(P2, Cut1, Cut2, SubP2),
    subtract(P1, SubP2, RestP1),
    append(SubP2, RestP1, C2).

% Perform mutation
mutation(Schedule, MutatedSchedule) :-
    prob_mutation(PM),
    random(0.0, 1.0, R),
    (R =< PM -> swap_random(Schedule, MutatedSchedule) ; MutatedSchedule = Schedule).

swap_random(Schedule, Mutated) :-
    length(Schedule, L),
    random(1, L, I), random(1, L, J),
    nth1(I, Schedule, Elem1), nth1(J, Schedule, Elem2),
    select(Elem1, Schedule, Temp), select(Elem2, Temp, Temp2),
    nth1(I, Mutated, Elem2, Temp2), nth1(J, Mutated, Elem1, Mutated).

% Run the Genetic Algorithm
run_ga :-
    initialize,
    generate_population(InitialPop),
    evaluate_population(InitialPop, EvaluatedPop),
    generations(NG),
    evolve(EvaluatedPop, 0, NG, BestSolution),
    write('Best solution: '), write(BestSolution), nl.

% Evaluate all schedules
evaluate_population([], []).
evaluate_population([Schedule | Rest], [Schedule * Fitness | EvaluatedRest]) :-
    evaluate_schedule(Schedule, Fitness),
    evaluate_population(Rest, EvaluatedRest).

% Evolve generations
evolve(Population, Gen, Gen, Best) :-
    select_individuals(Population, [Best | _]).
evolve(Population, CurrGen, MaxGen, Best) :-
    CurrGen < MaxGen,
    select_individuals(Population, Selected),
    generate_offspring(Selected, Offspring),
    evaluate_population(Offspring, EvaluatedOffspring),
    NextGen is CurrGen + 1,
    evolve(EvaluatedOffspring, NextGen, MaxGen, Best).

% Generate offspring
generate_offspring([], []).
generate_offspring([P1, P2 | Rest], [C1, C2 | Offspring]) :-
    crossover(P1, P2, C1, C2),
    mutation(C1, MC1), mutation(C2, MC2),
    generate_offspring(Rest, Offspring).
