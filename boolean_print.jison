
/* description: Parses end executes mathematical expressions. */

%{
var exp_list = null;
var exp_final;
%}

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[a-eg-su-z]           return 'VAR'
[TF]                  return 'BOOL'
"="                   return 'EQ'
"->"                  return 'RIMP'
"<-"                  return 'LIMP'
"|"                   return 'OR'
[X]                   return 'XOR'
"&"                   return 'AND'
"!"                   return 'NOT'
"("                   return 'LPAREN'
")"                   return 'RPAREN'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left BOOL
%left VAR
%left EQ
%left LIMP RIMP
%left OR XOR
%left AND
%left NOT
%left LPAREN RPAREN

%start expressions

%% /* language grammar */

expressions
    : eq EOF
        { exp_final = exp_list; exp_list = null; return exp_final; }
    ;

eq
    : eq EQ eq
        {$$ = $1 + " = " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR= " + $3);}
    | imp
        {$$ = $1;}
    ;

imp
    : imp RIMP imp
        {$$ = $1 + " -> " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR-> " + $3);}
    | imp LIMP imp
        {$$ = $1 + " <- " + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR<- " + $3);}
    | or
        {$$ = $1;}
    ;

or
    : or OR or
        {$$ = $1 + (" | ") + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR| " + $3);}
    | or XOR or
        {$$ = $1 + (" X ") + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CURX " + $3);}
    | and
        {$$ = $1;}
    ;

and
    : and AND and
        {$$ = $1 + (" & ") + $3; if(exp_list == null) exp_list = new Array(); exp_list.push($1 + " CUR& " + $3);}
    | not
        {$$ = $1;}
    ;

not
    : NOT primary
        {$$ = "!" + $2; if(exp_list == null) exp_list = new Array(); exp_list.push("CUR!" + $2);}
    | primary
        {$$ = $1;}
    ;

primary
    : LPAREN eq RPAREN
        {$$ = "(" + $2 + ")";}
    | BOOL
        {$$ = yytext;}
    | VAR
        {$$ = yytext;}
    ;

