:-dynamic assignment_surgery/2.
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.

% TODO: Use provided date in format yyyyMMdd
%:-consult('../knowledge_base/kb-{date}.pl').

agenda_staff(d20241,20451202,[]).
agenda_staff(d20242,20451202,[]).
agenda_staff(d20243,20451202,[]).
agenda_staff(d20244,20451202,[]).
agenda_staff(d20245,20451202,[]).
agenda_staff(d20246,20451202,[]).
agenda_staff(d20247,20451202,[]).
agenda_staff(d20248,20451202,[]).
%agenda_staff(N20241,20451202,[]).
%agenda_staff(N20242,20451202,[]).
%agenda_staff(N20243,20451202,[]).
%agenda_staff(N20244,20451202,[]).
%agenda_staff(N20245,20451202,[]).
%agenda_staff(N20246,20451202,[]).
%agenda_staff(T20241,20451202,[]).
%agenda_staff(T20242,20451202,[]).

timetable(d20241,20451202,(0,1440)).
timetable(d20242,20451202,(0,1440)).
timetable(d20243,20451202,(0,1440)).
timetable(d20244,20451202,(0,1440)).
timetable(d20245,20451202,(0,1440)).
timetable(d20246,20451202,(0,1440)).
timetable(d20247,20451202,(0,1440)).
timetable(d20248,20451202,(0,1440)).
%timetable(N20241,20451202,(600,1200)).
%timetable(N20242,20451202,(600,1200)).
%timetable(N20243,20451202,(600,1200)).
%timetable(N20244,20451202,(400,800)).
%timetable(N20245,20451202,(400,800)).
%timetable(N20246,20451202,(800,1440)).
%timetable(T20241,20451202,(800,1440)).
%timetable(T20242,20451202,(0,800)).

staff(d20241,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20242,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20243,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20244,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20245,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20246,doctor,orthopaedics,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20247,doctor,anaesthesiology,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
staff(d20248,doctor,anaesthesiology,[aCL_Reconstruction_Surgery,knee_Replacement_Surgery]).
%staff(N20241,Nurse,Instrumenting,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(N20242,Nurse,Instrumenting,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(N20243,Nurse,Anaesthesiology,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(N20244,Nurse,Anaesthesiology,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(N20245,Nurse,Circulating,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(N20246,Nurse,Circulating,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(T20241,Technician,Medical_Action,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).
%staff(T20242,Technician,Medical_Action,[ACL_Reconstruction_Surgery,Knee_Replacement_Surgery]).

surgery(aCL_Reconstruction_Surgery,45,60,30).
surgery(knee_Replacement_Surgery,45,60,45).

required_staff(aCL_Reconstruction_Surgery,doctor,orthopaedics,3).
required_staff(aCL_Reconstruction_Surgery,doctor,anaesthesiology,1).
%required_staff(ACL_Reconstruction_Surgery,Nurse,Instrumenting,1).
%required_staff(ACL_Reconstruction_Surgery,Nurse,Anaesthesiology,1).
%required_staff(ACL_Reconstruction_Surgery,Nurse,Circulating,1).
%required_staff(ACL_Reconstruction_Surgery,Technician,Medical_Action,1).
required_staff(knee_Replacement_Surgery,doctor,orthopaedics,3).
required_staff(knee_Replacement_Surgery,doctor,anaesthesiology,1).
%required_staff(Knee_Replacement_Surgery,Nurse,Instrumenting,1).
%required_staff(Knee_Replacement_Surgery,Nurse,Anaesthesiology,1).
%required_staff(Knee_Replacement_Surgery,Nurse,Circulating,1).
%required_staff(Knee_Replacement_Surgery,Technician,Medical_Action,1).

%TODO: UPDATE OPERATION REQUEST ID
surgery_id(1,aCL_Reconstruction_Surgery).
surgery_id(2,knee_Replacement_Surgery).
%surgery_id(3,Knee_Replacement_Surgery).

%assignment_surgery(1,d20241).
%assignment_surgery(1,d20242).
%assignment_surgery(1,d20243).
%assignment_surgery(1,d20247).
%assignment_surgery(2,d20244).
%assignment_surgery(2,d20245).
%assignment_surgery(2,d20246).
%assignment_surgery(2,d20248).
%assignment_surgery(3,D20241).
%assignment_surgery(3,D20242).
%assignment_surgery(3,D20244).
%assignment_surgery(3,D20247).

agenda_operation_room(or1,20451202,[]).

free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).


adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).

treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).

treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).


intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
					intersect_2_agendas(LD,LA1,LID),
					append(LI,LID,LIT).

intersect_availability((_,_),[],[],[]).

intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
		Fim<Ini1,!.

intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
		Ini>Fim1,!,
		intersect_availability((Ini,Fim),LD,LI,LA).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
		Fim1>Fim,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
		Fim>=Fim1,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_),
		intersect_availability((Fim1,Fim),LD,LI,LA).


min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).

%begin
assign_doctors_to_surgeries:-
    retractall(assignment_surgery),
    findall(OpReqId,surgery_id(OpReqId,_),OpReqs),
    assign_doctors_to_surgery(OpReqs).

assign_doctors_to_surgery([]):-!.

assign_doctors_to_surgery([OpReqId|LOpReqId]):-
    surgery_id(OpReqId,OpType),
    required_staff(OpType,doctor,Speciality,NumDoctors),
    findall(D,staff(D,doctor,Speciality,_),LDoctors),
    assign_doctors_to_surgery1(NumDoctors,LDoctors,OpReqId),
    assign_doctors_to_surgery(LOpReqId).

assign_doctors_to_surgery1(0,_,_):-!.
assign_doctors_to_surgery1(_,[],_):-!,fail.

assign_doctors_to_surgery1(NumDoctors,LDoctors,OpReqId):-
    random_member(D,LDoctors),
    assert(assignment_surgery(OpReqId,D)),
    NumDoctors1 is NumDoctors-1,
    assign_doctors_to_surgery1(NumDoctors1,LDoctors,OpReqId).
%end


schedule_all_surgeries(Room,Day):-
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    %assign_doctors_to_surgeries,
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
    findall(OpCode,surgery_id(OpCode,_),LOpCode),

    availability_all_surgeries(LOpCode,Room,Day),!.

availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    availability_operation(OpCode,Room,Day,LPossibilities,LDoctors),
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)),
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors),
    availability_all_surgeries(LOpCode,Room,Day).



availability_operation(OpCode,Room,Day,LPossibilities,LDoctors):-surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    findall(Doctor,assignment_surgery(OpCode,Doctor),LDoctors),
    intersect_all_agendas(LDoctors,Day,LA),
    agenda_operation_room1(Room,Day,LAgenda),
    free_agenda0(LAgenda,LFAgRoom),
    intersect_2_agendas(LA,LFAgRoom,LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery,LIntAgDoctorsRoom,LPossibilities).


remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).


schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.

insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).

insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).



obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
		get_time(Ti),
		(obtain_better_sol1(Room,Day);true),
		retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),
            write('Final Result: AgOpRoomBetter='),write(AgOpRoomBetter),nl,
            write('LAgDoctorsBetter='),write(LAgDoctorsBetter),nl,
            write('TFinOp='),write(TFinOp),nl,
		get_time(Tf),
		T is Tf-Ti,
		write('Tempo de geracao da solucao:'),write(T),nl.


obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,
    permutation(LOC,LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),
    %assign_doctors_to_surgeries,
    availability_all_surgeries(LOpCode,Room,Day),
    agenda_operation_room1(Room,Day,AgendaR),
		update_better_sol(Day,Room,AgendaR,LOpCode),
		fail.

update_better_sol(Day,Room,Agenda,LOpCode):-
                better_sol(Day,Room,_,_,FinTime),
                reverse(Agenda,AgendaR),
                evaluate_final_time(AgendaR,LOpCode,FinTime1),
             write('Analysing for LOpCode='),write(LOpCode),nl,
             write('now: FinTime1='),write(FinTime1),write(' Agenda='),write(Agenda),nl,
		FinTime1<FinTime,
             write('best solution updated'),nl,
                retract(better_sol(_,_,_,_,_)),
                findall(Doctor,assignment_surgery(_,Doctor),LDoctors1),
                remove_equals(LDoctors1,LDoctors),
                list_doctors_agenda(Day,LDoctors,LDAgendas),
		asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).

evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-agenda_staff1(D,Day,AgD),list_doctors_agenda(Day,LD,LAgD).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).

schedule_appointments(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
    assign_doctors_to_surgeries,
    schedule_all_surgeries(Room,Day),
    obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp).
