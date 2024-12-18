agenda_staff(d20241,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(d20242,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(d20243,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(d20244,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(n20241,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(n20242,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(n20243,20260810,[(100,235,ap1),(1080,1215,ap2)]).
agenda_staff(t20241,20260810,[(100,235,ap1),(1080,1215,ap2)]).

timetable(d20241,20260810,(0,1440)).
timetable(d20242,20260810,(0,1440)).
timetable(d20243,20260810,(0,1440)).
timetable(d20244,20260810,(0,1440)).
timetable(n20241,20260810,(0,1440)).
timetable(n20242,20260810,(0,1440)).
timetable(n20243,20260810,(0,1440)).
timetable(t20241,20260810,(0,1440)).

staff(d20241,doctor,orthopaedics,[typ1,typ2,typ3]).
staff(d20242,doctor,orthopaedics,[typ1,typ2,typ3]).
staff(d20243,doctor,orthopaedics,[typ1,typ2,typ3]).
staff(d20244,doctor,anaesthesiology,[typ1,typ2,typ3]).
staff(n20241,nurse,instrumenting,[typ1,typ2,typ3]).
staff(n20242,nurse,anaesthesiology,[typ1,typ2,typ3]).
staff(n20243,nurse,circulating,[typ1,typ2,typ3]).
staff(t20241,technician,medical_Action,[typ1,typ2,typ3]).

surgery(typ1,45,60,30).
surgery(typ2,60,90,45).
surgery(typ3,90,120,60).

required_staff(typ1,doctor,orthopaedics,3,false,true,false).
required_staff(typ1,doctor,anaesthesiology,1,true,true,false).
required_staff(typ1,nurse,instrumenting,1,false,true,false).
required_staff(typ1,nurse,anaesthesiology,1,true,true,false).
required_staff(typ1,nurse,circulating,1,false,true,false).
required_staff(typ1,technician,medical_Action,1,false,true,true).
required_staff(typ2,doctor,orthopaedics,3,false,true,false).
required_staff(typ2,doctor,anaesthesiology,1,true,true,false).
required_staff(typ2,nurse,instrumenting,1,false,true,false).
required_staff(typ2,nurse,anaesthesiology,1,true,true,false).
required_staff(typ2,nurse,circulating,1,false,true,false).
required_staff(typ2,technician,medical_Action,1,false,true,true).
required_staff(typ3,doctor,orthopaedics,2,false,true,false).
required_staff(typ3,doctor,anaesthesiology,1,true,true,false).
required_staff(typ3,nurse,instrumenting,1,false,true,false).
required_staff(typ3,nurse,anaesthesiology,1,true,true,false).
required_staff(typ3,nurse,circulating,1,false,true,false).
required_staff(typ3,technician,medical_Action,1,false,true,true).

surgery_id(req3,typ1).
surgery_id(req4,typ1).
surgery_id(req5,typ2).

agenda_operation_room(or1,20260810,[(100,235,ap1)]).
agenda_operation_room(or2,20260810,[(1080,1215,ap2)]).