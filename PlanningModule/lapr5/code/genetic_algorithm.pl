:- consult('C:\\Users\\david\\Documents\\ISEP\\sem5pi-24-25-g031\\PlanningModule\\lapr5\\knowledge_base\\kb-20260810.pl').

% Dynamic predicates to store parameters and solutions
:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.


% Genetic algorithm steps
generate :-
    write('Starting genetic algorithm...'), nl,
    initialize_parameters,
    write('Parameters initialized.'), nl,
    generate_population(Pop),
    write('Generated population: '), write(Pop), nl,
    evaluate_population(Pop, EvaluatedPop),
    write('Evaluated population: '), write(EvaluatedPop), nl,
    order_population(EvaluatedPop, OrderedPop),
    write('Ordered population: '), write(OrderedPop), nl,
    generations(MaxGenerations),
    write('Evolution started...'), nl,
    evolve_generations(0, MaxGenerations, OrderedPop),
    write('Evolution completed.'), nl.


% Parameters initialization
initialize_parameters :- 
    % Only ask for input once
    retractall(generations(_)),
    retractall(population(_)),
    retractall(prob_crossover(_)),
    retractall(prob_mutation(_)),
    
    write('Enter the number of new generations: '), read(NG),
    asserta(generations(NG)),
    write('Enter the population size: '), read(PS),
    asserta(population(PS)),
    write('Enter the probability of crossover (%): '), read(P1),
    PC is P1 / 100,
    asserta(prob_crossover(PC)),
    write('Enter the probability of mutation (%): '), read(P2),
    PM is P2 / 100,
    asserta(prob_mutation(PM)).

% Generate initial population
generate_population(Pop) :-
    write('Generating population...'), nl,
    population(PopSize),
    write('Population size: '), write(PopSize), nl,
    findall(Surgery, surgery_id(Surgery, _), Surgeries),
    write('Surgeries: '), write(Surgeries), nl,
    generate_population(PopSize, Surgeries, Pop).

generate_population(0, _, []) :- !.
generate_population(PopSize, Surgeries, [Individual | Rest]) :-
    PopSize1 is PopSize - 1,
    generate_individual(Surgeries, Individual),
    generate_population(PopSize1, Surgeries, Rest).

generate_individual(Surgeries, Individual) :-
    findall(Staff, staff(Staff, _, _, _), StaffPool),
    assign_surgeries(Surgeries, StaffPool, Individual).


% Assign surgeries to staff ensuring constraints
assign_surgeries([], _, []).
assign_surgeries([Surgery | RestSurgeries], StaffPool, [(Surgery, Assignment) | RestAssignments]) :-
    surgery_id(Surgery, SurgeryType),
    find_required_staff(SurgeryType, StaffPool, Assignment),
    assign_surgeries(RestSurgeries, StaffPool, RestAssignments).

find_required_staff(SurgeryType, StaffPool, Assignment) :-
    findall(Role-Speciality-Num,
            required_staff(SurgeryType, Role, Speciality, Num, _, _, _),
            Requirements),
    satisfy_requirements(Requirements, StaffPool, Assignment).

satisfy_requirements([], _, []).
satisfy_requirements([Role-Speciality-Num | Rest], StaffPool, [Assigned | RestAssigned]) :-
    find_qualified_staff(Role, Speciality, StaffPool, QualifiedStaff),
    select_staff(QualifiedStaff, Num, Assigned),
    satisfy_requirements(Rest, StaffPool, RestAssigned).

find_qualified_staff(Role, Speciality, StaffPool, QualifiedStaff) :-
    include(is_qualified(Role, Speciality), StaffPool, QualifiedStaff).

is_qualified(Role, Speciality, Staff) :-
    staff(Staff, Role, Speciality, _).

select_staff(_, 0, []).
select_staff(QualifiedStaff, Num, [Staff | Rest]) :-
    Num > 0,
    random_member(Staff, QualifiedStaff),
    delete(QualifiedStaff, Staff, UpdatedStaff),
    Num1 is Num - 1,
    select_staff(UpdatedStaff, Num1, Rest).

% Fitness function
evaluate_population([], []).
evaluate_population([Ind | Rest], [Ind*Fitness | RestFitness]) :-
    write('Evaluating individual: '), write(Ind), nl,
    evaluate(Ind, Fitness),
    write('Fitness: '), write(Fitness), nl,
    evaluate_population(Rest, RestFitness).

evaluate([], 0).
evaluate([(Surgery, _Staff) | Rest], TotalFitness) :-
    write('Evaluating surgery: '), write(Surgery), nl,
    surgery_id(Surgery, Type),
    surgery(Type, T1, T2, T3),
    write('Task parameters: '), write((T1, T2, T3)), nl,
    % Compute lateness T3
    PenaltyCost is T1 + T2 + T3,
    write('Penalty cost: '), write(PenaltyCost), nl,
    evaluate(Rest, RestFitness),
    write('Evaluation value so far: '), write(RestFitness), nl,
    TotalFitness is PenaltyCost + RestFitness.

order_population(PopValue,PopValueOrd):-
    bsort(PopValue,PopValueOrd).

% Check if any constraint is violated
violates_constraint(Schedule) :-
    % Example: A doctor performing multiple surgeries at the same time
    member((Doctor, _), Schedule),
    findall(Time, member((Doctor, Time), Schedule), Times),
    sort(Times, SortedTimes),
    length(SortedTimes, Length),
    Length \= 1.  % If there is more than one surgery for the same doctor at the same time, it violates the constraint

bsort([X], [X]) :- !.
bsort([X | Xs], Ys) :-
    bsort(Xs, Zs),
    bchange([X | Zs], Ys).

bchange([X], [X]) :- !.

bchange([X * VX, Y * VY | L1], [Y * VY | L2]) :-
    VX > VY, !,
    bchange([X * VX | L1], L2).

bchange([X | L1], [X | L2]) :- bchange(L1, L2).

evolve_generations(Current, Max, Pop) :-
    Current >= Max, !,
    write('Final Generation: '), write(Pop), nl.

evolve_generations(Current, Max, Pop) :-
    Current < Max,
    write('Generation '), write(Current), write(': '), nl, write(Pop), nl,
    crossover_population(Pop, CrossoverPop),
    write('Crossover population: '), write(CrossoverPop), nl,
    mutate_population(CrossoverPop, MutatedPop),
    write('Mutated population: '), write(MutatedPop), nl,
    evaluate_population(MutatedPop, EvaluatedPop),
    write('Evaluated population: '), write(EvaluatedPop), nl,
    order_population(EvaluatedPop, OrderedPop),
    write('Ordered population: '), write(OrderedPop), nl,
    NextGen is Current + 1,
    write('Next generation: '), write(NextGen), nl,
    evolve_generations(NextGen, Max, OrderedPop).

% Crossover operators
%% Crossover between two individuals
crossover_population([ ],[ ]).
crossover_population([Ind*_],[Ind]).
crossover_population([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1]):-
	write('Crossover between: '), write(Ind1), write(' and '), write(Ind2), nl,
    generate_crossover_points(P1,P2),
    write('Crossover points: '), write((P1, P2)), nl,
	prob_crossover(Pcruz),
    write('Crossover probability: '), write(Pcruz), nl,
    random(0.0,1.0,Pc),
    write('Random number: '), write(Pc), nl,
	((Pc =< Pcruz,!,
        write('Performing crossover...'), nl,
        crossover_individuals(Ind1,Ind2,P1,P2,NInd1),
        write('First offspring: '), write(NInd1), nl,
	  crossover_individuals(Ind2,Ind1,P1,P2,NInd2)
      ));

    write('No crossover...'), nl,
	(NInd1=Ind1,NInd2=Ind2),
    write('New population: '), write(Rest1), nl,
	crossover_population(Rest,Rest1).

%% Crossover between two individuals - Split at a random point
crossover_individuals(Ind1,Ind2,P1,P2,NInd11):-
    write('Individuals'), nl,
    write('Crossover between: '), write(Ind1), write(' and '), write(Ind2), nl,
    write('Crossover points: '), write((P1, P2)), nl,
    sublist(Ind1,P1,P2,Sub1),
    write('Sublist 1: '), write(Sub1), nl,
    write('generations(NumT): NumT = '), write(generations(NumT)), nl,
    generations(NumT),
    write('Number of tasks: '), write(NumT), nl,
    R is NumT-P2,
    write('R: '), write(R), nl,
    rotate_right(Ind2,R,Ind21),
    write('Rotated individual: '), write(Ind21), nl,
    remove(Ind21,Sub1,Sub2),
    write('Removed sublist: '), write(Sub2), nl,
    P3 is P2 + 1,
    write('Crossover point: '), write(P3), nl,
    insert(Sub2,Sub1,P3,NInd1),
    write('First offspring: '), write(NInd1), nl,
    removeh(NInd1,NInd11).

removeh([],[]):-!.

removeh([h|R1],R2):-!,
    removeh(R1,R2).

removeh([X|R1],[X|R2]):-
    removeh(R1,R2).

sublist(L1,I1,I2,L):-
    sublist1(L1,I1,I2,L).

sublist(L1,I1,I2,L):-
    write('Sublist 1'), nl,
    sublist1(L1,I2,I1,L).

sublist1([X|R1],1,1,[X|H]):-!,
    write('Sublist 2'), nl,
    fillh(R1,H).

sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
	sublist1(R1,1,N3,R2).

sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
		N4 is N2 - 1,
		sublist1(R1,N3,N4,R2).

rotate_right(L,K,L1):- generations(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):- N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).

remove([],_,[]):-!.

remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
        remove(R1,L,R2).

remove([_|R1],L,R2):-
    remove(R1,L,R2).

insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
    generations(T),
    ((N>T,!,N1 is N mod T);N1 = N),
    insert1(X,N1,L,L1),
    N2 is N + 1,
    insert(R,L1,N2,L2).


insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
    N1 is N-1,
    insert1(X,N1,L,L1).

fillh([ ],[ ]).

fillh([_|R1],[h|R2]):-
	fillh(R1,R2).

%% Helper function to generate random crossover points
generate_crossover_points(P1, P2) :- 
    write('Generating crossover points...'), nl,
    generations(N), 
    write('Number of tasks: '), write(N), nl,
    NTemp is N + 1,
    random(1, NTemp, P11), 
    random(1, NTemp, P21),
    P11 \= P21,  % Ensure points are different
    (P11 < P21 -> P1 = P11, P2 = P21; P1 = P21, P2 = P11).

% Mutation operators
% Mutate each individual in the population
mutate_population([], []).  % Base case when no individuals left.

mutate_population([Ind | Req], [NInd | Rest1]) :-
    write('Mutating individual: '), write(Ind), nl,
    prob_mutation(PM),
    write('Mutation probability: '), write(PM), nl,
    random(0.0, 1.0, P),
    write('Random number: '), write(P), nl,
    (P =< PM -> mutacao1(Ind, NInd); NInd = Ind),
    write('Mutated individual: '), write(NInd), nl,
    mutate_population(Req, Rest1).

mutacao1(Ind, NInd) :-
    generate_crossover_points(P1, P2),
    mutacao22(Ind, P1, P2, NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).