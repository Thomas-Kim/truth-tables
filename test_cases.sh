echo "T | F" > test_case.dat

make

eval_test_1=`node boolean_evaluate.js test_case.dat`
print_test_1=`node boolean_print.js test_case.dat`

$eval_test_1
echo $print_test_1
