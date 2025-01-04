:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).

start_server(Port) :-
    http_server(http_dispatch, [port(Port)]).

:- http_handler(root(run), handle_request, []).

handle_request(Request) :-
    member(method(post), Request),
    http_read_json_dict(Request, Dict),
    (   _{code: PrologCode} :< Dict
    ->
        (   catch(run_prolog(PrologCode, Result), Error, Result = _{error: Error})
        ->  reply_json_dict(Result)
        ;   reply_json_dict(_{error: "Failed to execute Prolog code"})
        )
    ;   reply_json_dict(_{error: "Invalid request format. Expected {code: \"<prolog_code>\"}"})
    ).

run_prolog(Code, _{output: Output}) :-
    read_term_from_atom(Code, Goal, []),
    with_output_to(string(Output), call(Goal)).

:- initialization(start_server(8080)).