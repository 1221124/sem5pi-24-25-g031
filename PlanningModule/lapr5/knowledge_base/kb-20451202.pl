agenda_staff(D20241,20451202,[(400,480,ap1)]).
agenda_staff(D20242,20451202,[(400,480,ap1)]).
agenda_staff(D20243,20451202,[(400,480,ap1)]).
agenda_staff(D20244,20451202,[]).
agenda_staff(D20245,20451202,[]).
agenda_staff(D20246,20451202,[]).
agenda_staff(D20247,20451202,[(400,480,ap1)]).
agenda_staff(D20248,20451202,[]).
%agenda_staff(N20241,20451202,[]).
%agenda_staff(N20242,20451202,[]).
%agenda_staff(N20243,20451202,[]).
%agenda_staff(N20244,20451202,[]).
%agenda_staff(N20245,20451202,[]).
%agenda_staff(N20246,20451202,[]).
%agenda_staff(T20241,20451202,[]).
%agenda_staff(T20242,20451202,[]).

timetable(D20241,20451202,(420,1020)).
timetable(D20242,20451202,(420,1020)).
timetable(D20243,20451202,(540,1080)).
timetable(D20244,20451202,(480,1020)).
timetable(D20245,20451202,(420,1140)).
timetable(D20246,20451202,(540,1080)).
timetable(D20247,20451202,(600,1200)).
timetable(D20248,20451202,(600,1200)).
%timetable(N20241,20451202,(600,1200)).
%timetable(N20242,20451202,(600,1200)).
%timetable(N20243,20451202,(600,1200)).
%timetable(N20244,20451202,(400,800)).
%timetable(N20245,20451202,(400,800)).
%timetable(N20246,20451202,(800,1440)).
%timetable(T20241,20451202,(800,1440)).
%timetable(T20242,20451202,(0,800)).

staff(D20241,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20242,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20243,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20244,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20245,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20246,Doctor,'Orthopaedics',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20247,Doctor,'Anaesthesiology',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
staff(D20248,Doctor,'Anaesthesiology',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20241,Nurse,'Instrumenting',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20242,Nurse,'Instrumenting',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20243,Nurse,'Anaesthesiology',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20244,Nurse,'Anaesthesiology',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20245,Nurse,'Circulating',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(N20246,Nurse,'Circulating',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(T20241,Technician,'Medical Action',['ACL Reconstruction Surgery','Knee Replacement Surgery']).
%staff(T20242,Technician,'Medical Action',['ACL Reconstruction Surgery','Knee Replacement Surgery']).

surgery('ACL Reconstruction Surgery',45,60,30).
surgery('Knee Replacement Surgery',45,60,45).

%required_staff('ACL Reconstruction Surgery',[(Doctor,Orthopaedics,3),(Doctor,Anaesthesiology,1),(Nurse,Instrumenting,1),(Nurse,Anaesthesiology,1),(Nurse,Circulating,1),(Technician,Medical Action,1)]).
%required_staff('Knee Replacement Surgery',[(Doctor,Orthopaedics,3),(Doctor,Anaesthesiology,1),(Nurse,Instrumenting,1),(Nurse,Anaesthesiology,1),(Nurse,Circulating,1),(Technician,Medical Action,1)]).
required_staff('ACL Reconstruction Surgery',[(Doctor,Orthopaedics,3),(Doctor,Anaesthesiology,1)]).
required_staff('Knee Replacement Surgery',[(Doctor,Orthopaedics,3),(Doctor,Anaesthesiology,1)]).

%TODO: UPDATE OPERATION REQUEST ID
surgery_id('1','ACL Reconstruction Surgery').
surgery_id('2','ACL Reconstruction Surgery').
surgery_id('3','Knee Replacement Surgery').
surgery_id('4','Knee Replacement Surgery').

agenda_operation_room(OR1,20451202,[(400,480,ap1)]).