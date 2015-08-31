%{
var exp_list = null;
var exp_final;
%}

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[TF]                    return 'BOOL'
"="                     return 'EQ'
"->"                    return 'RIMP'
"<-"                    return 'LIMP'
"D"                  return 'NAND'
"R"                   return 'NOR'
"|"                     return 'OR'
(X)                     return 'XOR'
"&"                     return 'AND'
"!"                     return 'NOT'
"("                     return 'LPAREN'
")"                     return 'RPAREN'
<<EOF>>                 return 'EOF'
[a-eg-mo-su-z]  return 'VAR'
.                       return 'INVALID'

/lex

/* operator associations and precedence */

%left LPAREN RPAREN
%left NOT
%left AND NAND
%left OR XOR NOR
%left LIMP RIMP
%left EQ
%left BOOL
%left VAR

%start expressions

%% /* language grammar */

expressions
    : eq EOF
        { exp_final = exp_list; exp_list = null; return exp_final; }
    ;

eq
    : eq EQ eq
        { $$ = $1 + " = " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR= " + $3); }
    | imp
        { $$ = $1;}
    ;

imp
    : imp RIMP imp
        { $$ = $1 + " -> " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR-> " + $3); }
    | imp LIMP imp
        { $$ = $1 + " <- " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR<- " + $3); }
    | or
        { $$ = $1;}
    ;

or
    : or OR or
        { $$ = $1 + " | " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR| " + $3); }
    | or XOR or
        { $$ = $1 + " X " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CURX " + $3); }
    | or NOR or
        { $$ = $1 + " R " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CURR " + $3); }
    | and
        { $$ = $1;}
    ;

and
    : and AND and
        { $$ = $1 + " & " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR& " + $3); }
    | and NAND and
        { $$ = $1 + " D " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CURD " + $3); }
    | not
        { $$ = $1;}
    ;

not
    : NOT not
        { $$ = "!" + $2; if(exp_list == null) exp_list = new Array(); exp_list.push("CUR!" + $2); }
    | primary
        { $$ = $1; }
    ;

primary
    : LPAREN eq RPAREN
        { $$ = "(" + $2 + ")"; }
    | BOOL
        { $$ = yytext; }
    | VAR
        { $$ = yytext; }
    ;

