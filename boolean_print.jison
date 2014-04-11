
/* description: Parses end executes mathematical expressions. */

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
"X"                   return 'XOR'
"&"                   return 'AND'
"!"                   return 'NOT'
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '(' ')'
%left 'NOT'
%left 'AND'
%left 'XOR'
%left 'OR'
%left 'LIMP'
%left 'RIMP'
%left 'EQ'
%left 'BOOL'
%left 'VAR'

%start expressions

%% /* language grammar */

expressions
    : eq EOF
        { return $1; }
    ;

eq
    : rimp 'EQ' eq
        {$$ = $1 + " = " + $3; console.log($$);}
    | rimp
        {$$ = $1;}
    ;

rimp
    : limp 'RIMP' rimp
        {$$ = $1 + " -> " + $3; console.log($$);}
    | limp
        {$$ = $1;}
    ;

limp
    : or 'LIMP' limp
        {$$ = $1 + (" <- ") + $3; console.log($$);}
    | or
        {$$ = $1;}
    ;

or
    : xor 'OR' or
        {$$ = $1 + (" | ") + $3; console.log($$);}
    | xor
        {$$ = $1;}
    ;

xor
    : and 'XOR' xor
        {$$ = $1 + (" X ") + $3; console.log($$);}
    | and
        {$$ = $1;}
    ;

and
    : not 'AND' and
        {$$ = $1 + (" & ") + $3; console.log($$);}
    | not
        {$$ = $1;}
    ;

not
    : 'NOT' primary
        {$$ = "!" + $2; console.log($$);}
    | primary
        {$$ = $1;}
    ;

primary
    : '(' eq ')'
        {$$ = "(" + $2 + ")";}
    | BOOL
        {$$ = yytext;}
    | VAR
        {$$ = yytext;}
    ;

