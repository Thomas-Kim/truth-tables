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
(NAND)                  return 'NAND'
(NOR)                   return 'NOR'
"|"                     return 'OR'
(X)                     return 'XOR'
"&"                     return 'AND'
"!"                     return 'NOT'
"("                     return 'LPAREN'
")"                     return 'RPAREN'
(CUR)                   return 'CUR'
<<EOF>>                 return 'EOF'
[a-eg-su-zA-EG-SU-WYZ]  return 'VAR'
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
    : top EOF
        { console.log(exp_list); exp_final = exp_list; exp_list = null; return exp_final; }
    ;

top
    : LPAREN top RPAREN
    | half CUR EQ half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR LIMP half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR RIMP half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR OR half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR XOR half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR NOR half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR AND half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | half CUR NAND half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($1); exp_list.push($4); }
    | CUR NOT half
        { if(exp_list == null) exp_list = new Array(); exp_list.push($3); }
    ;

half
    : LPAREN half RPAREN    %prec AND
        { $$ = $2; }
    | eq                    %prec EQ
        { $$ = $1; }
    ;

eq
    : eq EQ eq
        { $$ = $1 + " = " + $3; }
    | imp
        { $$ = $1; }
    ;

imp
    : imp RIMP imp
        { $$ = $1 + " -> " + $3; }
    | imp LIMP imp
        { $$ = $1 + " <- " + $3; }
    | or
        { $$ = $1; }
    ;

or
    : or OR or
        { $$ = $1 + " | " + $3; }
    | or XOR or
        { $$ = $1 + " X " + $3; }
    | or NOR or
        { $$ = $1 + " NOR " + $3; }
    | and
        { $$ = $1; }
    ;

and
    : and AND and
        { $$ = $1 + " & " + $3; }
    | and NAND and
        { $$ = $1 + " NAND " + $3; }
    | not
        { $$ = $1; }
    ;

not
    : NOT not
        { $$ = "!" + $2; }
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

