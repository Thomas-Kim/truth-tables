
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
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

%start expressions

%% /* language grammar */

expressions
    : eq EOF
        { console.log($1);
          return $1; }
    ;

eq
    : rimp 'EQ' eq
        {$$ = (!$1 || $2) || ($1 || !$2);}
    | rimp
        {$$ = $1;}
    ;

rimp
    : limp 'RIMP' rimp
        {$$ = !$1 || $3;}
    | limp
        {$$ = $1;}
    ;

limp
    : or 'LIMP' limp
        {$$ = $1 || !$3;}
    | or
        {$$ = $1;}
    ;

or
    : xor 'OR' or
        {$$ = $1 || $3;}
    | xor
        {$$ = $1;}
    ;

xor
    : and 'XOR' xor
        {$$ = !$1 && $3 || $1 && !$3;}
    | and
        {$$ = $1;}
    ;

and
    : not 'AND' and
        {$$ = $1 && $3;}
    | not
        {$$ = $1;}
    ;

not
    : 'NOT' primary
        {$$ = !$2;}
    | primary
        {$$ = $1;}
    ;

primary
    : '(' eq ')'
        {$$ = $2;}
    | BOOL
        {$$ = yytext == 'T';}
    ;

