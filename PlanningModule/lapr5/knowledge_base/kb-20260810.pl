agenda_staff(n20245,20260810,[]).
agenda_staff(d20242,20260810,[]).
agenda_staff(n20242,20260810,[]).
agenda_staff(n20248,20260810,[]).
agenda_staff(t20244,20260810,[]).
agenda_staff(t20241,20260810,[]).
agenda_staff(n20244,20260810,[]).
agenda_staff(n202410,20260810,[]).
agenda_staff(d20244,20260810,[]).
agenda_staff(t20243,20260810,[]).
agenda_staff(n20249,20260810,[]).
agenda_staff(n20241,20260810,[]).
agenda_staff(d20249,20260810,[]).
agenda_staff(d20246,20260810,[]).
agenda_staff(d20241,20260810,[]).
agenda_staff(t20242,20260810,[]).
agenda_staff(d20248,20260810,[]).
agenda_staff(n20247,20260810,[]).
agenda_staff(d20247,20260810,[]).
agenda_staff(d20245,20260810,[]).
agenda_staff(n20246,20260810,[]).
agenda_staff(d202410,20260810,[]).
agenda_staff(n20243,20260810,[]).
agenda_staff(d20243,20260810,[]).

timetable(n20245,20260810,(0,1439)).
timetable(d20242,20260810,(0,1439)).
timetable(n20242,20260810,(0,1439)).
timetable(n20248,20260810,(0,1439)).
timetable(t20244,20260810,(0,1439)).
timetable(t20241,20260810,(0,1439)).
timetable(n20244,20260810,(0,1439)).
timetable(n202410,20260810,(0,1439)).
timetable(d20244,20260810,(0,1439)).
timetable(t20243,20260810,(0,1439)).
timetable(n20249,20260810,(0,1439)).
timetable(n20241,20260810,(0,1439)).
timetable(d20249,20260810,(0,1439)).
timetable(d20246,20260810,(0,1439)).
timetable(d20241,20260810,(0,1439)).
timetable(t20242,20260810,(0,1439)).
timetable(d20248,20260810,(0,1439)).
timetable(n20247,20260810,(0,1439)).
timetable(d20247,20260810,(0,1439)).
timetable(d20245,20260810,(0,1439)).
timetable(n20246,20260810,(0,1439)).
timetable(d202410,20260810,(0,1439)).
timetable(n20243,20260810,(0,1439)).
timetable(d20243,20260810,(0,1439)).

staff(n20245,nurse,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20242,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20242,nurse,instrumenting,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20248,nurse,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(t20244,technician,x_Ray,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(t20241,technician,medical_Action,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20244,nurse,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n202410,nurse,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20244,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(t20243,technician,medical_Action,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20249,nurse,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20241,nurse,instrumenting,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20249,doctor,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20246,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20241,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(t20242,technician,medical_Action,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20248,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20247,nurse,circulating,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20247,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20245,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20246,nurse,circulating,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d202410,doctor,anaesthesiology,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(n20243,nurse,instrumenting,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).
staff(d20243,doctor,orthopaedics,[aCL_Reconstrution_Surgery,knee_Replacement_Surgery]).

surgery(aCL_Reconstrution_Surgery,45,60,30).
surgery(knee_Replacement_Surgery,45,60,45).

required_staff(aCL_Reconstrution_Surgery,doctor,orthopaedics,3).
required_staff(aCL_Reconstrution_Surgery,doctor,anaesthesiology,1).
required_staff(aCL_Reconstrution_Surgery,nurse,anaesthesiology,1).
required_staff(aCL_Reconstrution_Surgery,nurse,circulating,1).
required_staff(aCL_Reconstrution_Surgery,nurse,instrumenting,1).
required_staff(aCL_Reconstrution_Surgery,technician,medical_Action,1).
required_staff(knee_Replacement_Surgery,doctor,orthopaedics,3).
required_staff(knee_Replacement_Surgery,doctor,anaesthesiology,1).
required_staff(knee_Replacement_Surgery,nurse,instrumenting,1).
required_staff(knee_Replacement_Surgery,nurse,anaesthesiology,1).
required_staff(knee_Replacement_Surgery,nurse,circulating,1).
required_staff(knee_Replacement_Surgery,technician,medical_Action,1).

surgery_id(req2,aCL_Reconstrution_Surgery).
surgery_id(req3,aCL_Reconstrution_Surgery).
surgery_id(req1,aCL_Reconstrution_Surgery).

agenda_operation_room(or1,20260810,[]).