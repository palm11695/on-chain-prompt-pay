pragma circom 2.1.4;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/gates.circom";

// template MultiOR(n) {
// 	signal input in[n];
// 	signal output out;

// 	signal sums[n];
// 	sums[0] <== in[0];
// 	for (var i = 1; i < n; i++) {
// 		sums[i] <== sums[i-1] + in[i];
// 	}
// 	component is_zero = IsZero();
// 	is_zero.in <== sums[n-1];
// 	out <== 1 - is_zero.out;
// }

template KbankAccountRegex (msg_bytes, reveal_bytes, group_idx){
	signal input in[msg_bytes];
	signal input match_idx;
	signal output start_idx;
	signal output group_match_count;
	signal output entire_count;

	signal reveal_shifted_intermediate[reveal_bytes][msg_bytes];
	signal output reveal_shifted[reveal_bytes];

	signal forw_adj_reveal[msg_bytes];

	signal m3_in[msg_bytes];
	signal m3_adj_reveal[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		m3_in[i] <== in[msg_bytes - i - 1];
	}

	component forw_eq[14][msg_bytes];
	component forw_lt[2][msg_bytes];
	component forw_and[15][msg_bytes];
	component forw_multi_or[3][msg_bytes];
	signal forw_states[msg_bytes+1][14];
	
	for (var i = 0; i < msg_bytes; i++) {
		forw_states[i][0] <== 1;
	}
	for (var i = 1; i < 14; i++) {
		forw_states[0][i] <== 0;
	}
	
	for (var i = 0; i < msg_bytes; i++) {
		//digits
		forw_lt[0][i] = LessThan(8);
		forw_lt[0][i].in[0] <== 47;
		forw_lt[0][i].in[1] <== in[i];
		forw_lt[1][i] = LessThan(8);
		forw_lt[1][i].in[0] <== in[i];
		forw_lt[1][i].in[1] <== 58;
		forw_and[0][i] = AND();
		forw_and[0][i].a <== forw_lt[0][i].out;
		forw_and[0][i].b <== forw_lt[1][i].out;
		//-
		forw_eq[0][i] = IsEqual();
		forw_eq[0][i].in[0] <== in[i];
		forw_eq[0][i].in[1] <== 45;
		forw_and[1][i] = AND();
		forw_and[1][i].a <== forw_states[i][1];
		forw_multi_or[0][i] = MultiOR(2);
		forw_multi_or[0][i].in[0] <== forw_and[0][i].out;
		forw_multi_or[0][i].in[1] <== forw_eq[0][i].out;
		forw_and[1][i].b <== forw_multi_or[0][i].out;
		//-
		forw_eq[1][i] = IsEqual();
		forw_eq[1][i].in[0] <== in[i];
		forw_eq[1][i].in[1] <== 45;
		forw_and[2][i] = AND();
		forw_and[2][i].a <== forw_states[i][13];
		forw_multi_or[1][i] = MultiOR(2);
		forw_multi_or[1][i].in[0] <== forw_and[0][i].out;
		forw_multi_or[1][i].in[1] <== forw_eq[1][i].out;
		forw_and[2][i].b <== forw_multi_or[1][i].out;
		forw_multi_or[2][i] = MultiOR(2);
		forw_multi_or[2][i].in[0] <== forw_and[1][i].out;
		forw_multi_or[2][i].in[1] <== forw_and[2][i].out;
		forw_states[i+1][1] <== forw_multi_or[2][i].out;
		//T
		forw_eq[2][i] = IsEqual();
		forw_eq[2][i].in[0] <== in[i];
		forw_eq[2][i].in[1] <== 84;
		forw_and[3][i] = AND();
		forw_and[3][i].a <== forw_states[i][0];
		forw_and[3][i].b <== forw_eq[2][i].out;
		forw_states[i+1][2] <== forw_and[3][i].out;
		//o
		forw_eq[3][i] = IsEqual();
		forw_eq[3][i].in[0] <== in[i];
		forw_eq[3][i].in[1] <== 111;
		forw_and[4][i] = AND();
		forw_and[4][i].a <== forw_states[i][2];
		forw_and[4][i].b <== forw_eq[3][i].out;
		forw_states[i+1][3] <== forw_and[4][i].out;
		// 
		forw_eq[4][i] = IsEqual();
		forw_eq[4][i].in[0] <== in[i];
		forw_eq[4][i].in[1] <== 32;
		forw_and[5][i] = AND();
		forw_and[5][i].a <== forw_states[i][3];
		forw_and[5][i].b <== forw_eq[4][i].out;
		forw_states[i+1][4] <== forw_and[5][i].out;
		//A
		forw_eq[5][i] = IsEqual();
		forw_eq[5][i].in[0] <== in[i];
		forw_eq[5][i].in[1] <== 65;
		forw_and[6][i] = AND();
		forw_and[6][i].a <== forw_states[i][4];
		forw_and[6][i].b <== forw_eq[5][i].out;
		forw_states[i+1][5] <== forw_and[6][i].out;
		//c
		forw_eq[6][i] = IsEqual();
		forw_eq[6][i].in[0] <== in[i];
		forw_eq[6][i].in[1] <== 99;
		forw_and[7][i] = AND();
		forw_and[7][i].a <== forw_states[i][5];
		forw_and[7][i].b <== forw_eq[6][i].out;
		forw_states[i+1][6] <== forw_and[7][i].out;
		//c
		forw_eq[7][i] = IsEqual();
		forw_eq[7][i].in[0] <== in[i];
		forw_eq[7][i].in[1] <== 99;
		forw_and[8][i] = AND();
		forw_and[8][i].a <== forw_states[i][6];
		forw_and[8][i].b <== forw_eq[7][i].out;
		forw_states[i+1][7] <== forw_and[8][i].out;
		//o
		forw_eq[8][i] = IsEqual();
		forw_eq[8][i].in[0] <== in[i];
		forw_eq[8][i].in[1] <== 111;
		forw_and[9][i] = AND();
		forw_and[9][i].a <== forw_states[i][7];
		forw_and[9][i].b <== forw_eq[8][i].out;
		forw_states[i+1][8] <== forw_and[9][i].out;
		//u
		forw_eq[9][i] = IsEqual();
		forw_eq[9][i].in[0] <== in[i];
		forw_eq[9][i].in[1] <== 117;
		forw_and[10][i] = AND();
		forw_and[10][i].a <== forw_states[i][8];
		forw_and[10][i].b <== forw_eq[9][i].out;
		forw_states[i+1][9] <== forw_and[10][i].out;
		//n
		forw_eq[10][i] = IsEqual();
		forw_eq[10][i].in[0] <== in[i];
		forw_eq[10][i].in[1] <== 110;
		forw_and[11][i] = AND();
		forw_and[11][i].a <== forw_states[i][9];
		forw_and[11][i].b <== forw_eq[10][i].out;
		forw_states[i+1][10] <== forw_and[11][i].out;
		//t
		forw_eq[11][i] = IsEqual();
		forw_eq[11][i].in[0] <== in[i];
		forw_eq[11][i].in[1] <== 116;
		forw_and[12][i] = AND();
		forw_and[12][i].a <== forw_states[i][10];
		forw_and[12][i].b <== forw_eq[11][i].out;
		forw_states[i+1][11] <== forw_and[12][i].out;
		//:
		forw_eq[12][i] = IsEqual();
		forw_eq[12][i].in[0] <== in[i];
		forw_eq[12][i].in[1] <== 58;
		forw_and[13][i] = AND();
		forw_and[13][i].a <== forw_states[i][11];
		forw_and[13][i].b <== forw_eq[12][i].out;
		forw_states[i+1][12] <== forw_and[13][i].out;
		// 
		forw_eq[13][i] = IsEqual();
		forw_eq[13][i].in[0] <== in[i];
		forw_eq[13][i].in[1] <== 32;
		forw_and[14][i] = AND();
		forw_and[14][i].a <== forw_states[i][12];
		forw_and[14][i].b <== forw_eq[13][i].out;
		forw_states[i+1][13] <== forw_and[14][i].out;
	}
	component forw_check_accepted[msg_bytes+1];
	for (var i = 0; i <= msg_bytes; i++) {
		forw_check_accepted[i] = MultiOR(1);
		forw_check_accepted[i].in[0] <== forw_states[i][1] ;
	}
	for (var i = 0; i < msg_bytes; i++) {
		forw_adj_reveal[i] <== forw_check_accepted[msg_bytes - i].out;
	}
	
	component m3_eq[14][msg_bytes];
	component m3_lt[2][msg_bytes];
	component m3_and[15][msg_bytes];
	component m3_multi_or[3][msg_bytes];
	signal m3_states[msg_bytes+1][14];
	signal m3_states_num[msg_bytes+1];
	
	for (var i = 0; i < msg_bytes; i++) {
		m3_states[i][0] <== forw_adj_reveal[i];
	}
	for (var i = 1; i < 14; i++) {
		m3_states[0][i] <== 0;
	}
	
	for (var i = 0; i < msg_bytes; i++) {
		//digits
		m3_lt[0][i] = LessThan(8);
		m3_lt[0][i].in[0] <== 47;
		m3_lt[0][i].in[1] <== m3_in[i];
		m3_lt[1][i] = LessThan(8);
		m3_lt[1][i].in[0] <== m3_in[i];
		m3_lt[1][i].in[1] <== 58;
		m3_and[0][i] = AND();
		m3_and[0][i].a <== m3_lt[0][i].out;
		m3_and[0][i].b <== m3_lt[1][i].out;
		//-
		m3_eq[0][i] = IsEqual();
		m3_eq[0][i].in[0] <== m3_in[i];
		m3_eq[0][i].in[1] <== 45;
		m3_and[1][i] = AND();
		m3_and[1][i].a <== m3_states[i][0];
		m3_multi_or[0][i] = MultiOR(2);
		m3_multi_or[0][i].in[0] <== m3_and[0][i].out;
		m3_multi_or[0][i].in[1] <== m3_eq[0][i].out;
		m3_and[1][i].b <== m3_multi_or[0][i].out;
		//-
		m3_eq[1][i] = IsEqual();
		m3_eq[1][i].in[0] <== m3_in[i];
		m3_eq[1][i].in[1] <== 45;
		m3_and[2][i] = AND();
		m3_and[2][i].a <== m3_states[i][1];
		m3_multi_or[1][i] = MultiOR(2);
		m3_multi_or[1][i].in[0] <== m3_and[0][i].out;
		m3_multi_or[1][i].in[1] <== m3_eq[1][i].out;
		m3_and[2][i].b <== m3_multi_or[1][i].out;
		m3_multi_or[2][i] = MultiOR(2);
		m3_multi_or[2][i].in[0] <== m3_and[1][i].out;
		m3_multi_or[2][i].in[1] <== m3_and[2][i].out;
		m3_states[i+1][1] <== m3_multi_or[2][i].out;
		// 
		m3_eq[2][i] = IsEqual();
		m3_eq[2][i].in[0] <== m3_in[i];
		m3_eq[2][i].in[1] <== 32;
		m3_and[3][i] = AND();
		m3_and[3][i].a <== m3_states[i][1];
		m3_and[3][i].b <== m3_eq[2][i].out;
		m3_states[i+1][2] <== m3_and[3][i].out;
		//:
		m3_eq[3][i] = IsEqual();
		m3_eq[3][i].in[0] <== m3_in[i];
		m3_eq[3][i].in[1] <== 58;
		m3_and[4][i] = AND();
		m3_and[4][i].a <== m3_states[i][2];
		m3_and[4][i].b <== m3_eq[3][i].out;
		m3_states[i+1][3] <== m3_and[4][i].out;
		//t
		m3_eq[4][i] = IsEqual();
		m3_eq[4][i].in[0] <== m3_in[i];
		m3_eq[4][i].in[1] <== 116;
		m3_and[5][i] = AND();
		m3_and[5][i].a <== m3_states[i][3];
		m3_and[5][i].b <== m3_eq[4][i].out;
		m3_states[i+1][4] <== m3_and[5][i].out;
		//n
		m3_eq[5][i] = IsEqual();
		m3_eq[5][i].in[0] <== m3_in[i];
		m3_eq[5][i].in[1] <== 110;
		m3_and[6][i] = AND();
		m3_and[6][i].a <== m3_states[i][4];
		m3_and[6][i].b <== m3_eq[5][i].out;
		m3_states[i+1][5] <== m3_and[6][i].out;
		//u
		m3_eq[6][i] = IsEqual();
		m3_eq[6][i].in[0] <== m3_in[i];
		m3_eq[6][i].in[1] <== 117;
		m3_and[7][i] = AND();
		m3_and[7][i].a <== m3_states[i][5];
		m3_and[7][i].b <== m3_eq[6][i].out;
		m3_states[i+1][6] <== m3_and[7][i].out;
		//o
		m3_eq[7][i] = IsEqual();
		m3_eq[7][i].in[0] <== m3_in[i];
		m3_eq[7][i].in[1] <== 111;
		m3_and[8][i] = AND();
		m3_and[8][i].a <== m3_states[i][6];
		m3_and[8][i].b <== m3_eq[7][i].out;
		m3_states[i+1][7] <== m3_and[8][i].out;
		//c
		m3_eq[8][i] = IsEqual();
		m3_eq[8][i].in[0] <== m3_in[i];
		m3_eq[8][i].in[1] <== 99;
		m3_and[9][i] = AND();
		m3_and[9][i].a <== m3_states[i][7];
		m3_and[9][i].b <== m3_eq[8][i].out;
		m3_states[i+1][8] <== m3_and[9][i].out;
		//c
		m3_eq[9][i] = IsEqual();
		m3_eq[9][i].in[0] <== m3_in[i];
		m3_eq[9][i].in[1] <== 99;
		m3_and[10][i] = AND();
		m3_and[10][i].a <== m3_states[i][8];
		m3_and[10][i].b <== m3_eq[9][i].out;
		m3_states[i+1][9] <== m3_and[10][i].out;
		//A
		m3_eq[10][i] = IsEqual();
		m3_eq[10][i].in[0] <== m3_in[i];
		m3_eq[10][i].in[1] <== 65;
		m3_and[11][i] = AND();
		m3_and[11][i].a <== m3_states[i][9];
		m3_and[11][i].b <== m3_eq[10][i].out;
		m3_states[i+1][10] <== m3_and[11][i].out;
		// 
		m3_eq[11][i] = IsEqual();
		m3_eq[11][i].in[0] <== m3_in[i];
		m3_eq[11][i].in[1] <== 32;
		m3_and[12][i] = AND();
		m3_and[12][i].a <== m3_states[i][10];
		m3_and[12][i].b <== m3_eq[11][i].out;
		m3_states[i+1][11] <== m3_and[12][i].out;
		//o
		m3_eq[12][i] = IsEqual();
		m3_eq[12][i].in[0] <== m3_in[i];
		m3_eq[12][i].in[1] <== 111;
		m3_and[13][i] = AND();
		m3_and[13][i].a <== m3_states[i][11];
		m3_and[13][i].b <== m3_eq[12][i].out;
		m3_states[i+1][12] <== m3_and[13][i].out;
		//T
		m3_eq[13][i] = IsEqual();
		m3_eq[13][i].in[0] <== m3_in[i];
		m3_eq[13][i].in[1] <== 84;
		m3_and[14][i] = AND();
		m3_and[14][i].a <== m3_states[i][12];
		m3_and[14][i].b <== m3_eq[13][i].out;
		m3_states[i+1][13] <== m3_and[14][i].out;
	}
	for (var i = 0; i < msg_bytes; i++) {
		m3_states_num[msg_bytes - i - 1] <==  m3_states[i][0]*0 + m3_states[i][1]*1 + m3_states[i][2]*2 + m3_states[i][3]*3 + m3_states[i][4]*4 + m3_states[i][5]*5 + m3_states[i][6]*6 + m3_states[i][7]*7 + m3_states[i][8]*8 + m3_states[i][9]*9 + m3_states[i][10]*10 + m3_states[i][11]*11 + m3_states[i][12]*12 + m3_states[i][13]*13;
	}
	
	component m3_check_accepted[msg_bytes+1];
	for (var i = 0; i <= msg_bytes; i++) {
		m3_check_accepted[i] = MultiOR(1);
		m3_check_accepted[i].in[0] <== m3_states[i][13] ;
	}
	for (var i = 0; i < msg_bytes; i++) {
		m3_adj_reveal[i] <== m3_check_accepted[msg_bytes - i - 1].out;
	}
	
	component eq[17][msg_bytes];
	component and[15][msg_bytes];
	component multi_or[3][msg_bytes];
	signal states[msg_bytes+1][15];
	
	for (var i = 0; i < msg_bytes; i++) {
		states[i][0] <== m3_adj_reveal[i];
	}
	for (var i = 1; i < 15; i++) {
		states[0][i] <== 0;
	}
	
	for (var i = 0; i < msg_bytes; i++) {
		//string compare: 13
		eq[0][i] = IsEqual();
		eq[0][i].in[0] <== m3_states_num[i];
		eq[0][i].in[1] <== 13;
		and[0][i] = AND();
		and[0][i].a <== states[i][0];
		and[0][i].b <== eq[0][i].out;
		states[i+1][1] <== and[0][i].out;
		//string compare: 12
		eq[1][i] = IsEqual();
		eq[1][i].in[0] <== m3_states_num[i];
		eq[1][i].in[1] <== 12;
		and[1][i] = AND();
		and[1][i].a <== states[i][1];
		and[1][i].b <== eq[1][i].out;
		states[i+1][2] <== and[1][i].out;
		//string compare: 11
		eq[2][i] = IsEqual();
		eq[2][i].in[0] <== m3_states_num[i];
		eq[2][i].in[1] <== 11;
		and[2][i] = AND();
		and[2][i].a <== states[i][2];
		and[2][i].b <== eq[2][i].out;
		states[i+1][3] <== and[2][i].out;
		//string compare: 10
		eq[3][i] = IsEqual();
		eq[3][i].in[0] <== m3_states_num[i];
		eq[3][i].in[1] <== 10;
		and[3][i] = AND();
		and[3][i].a <== states[i][3];
		and[3][i].b <== eq[3][i].out;
		states[i+1][4] <== and[3][i].out;
		//string compare: 9
		eq[4][i] = IsEqual();
		eq[4][i].in[0] <== m3_states_num[i];
		eq[4][i].in[1] <== 9;
		and[4][i] = AND();
		and[4][i].a <== states[i][4];
		and[4][i].b <== eq[4][i].out;
		states[i+1][5] <== and[4][i].out;
		//string compare: 8
		eq[5][i] = IsEqual();
		eq[5][i].in[0] <== m3_states_num[i];
		eq[5][i].in[1] <== 8;
		and[5][i] = AND();
		and[5][i].a <== states[i][5];
		and[5][i].b <== eq[5][i].out;
		states[i+1][6] <== and[5][i].out;
		//string compare: 7
		eq[6][i] = IsEqual();
		eq[6][i].in[0] <== m3_states_num[i];
		eq[6][i].in[1] <== 7;
		and[6][i] = AND();
		and[6][i].a <== states[i][6];
		and[6][i].b <== eq[6][i].out;
		states[i+1][7] <== and[6][i].out;
		//string compare: 6
		eq[7][i] = IsEqual();
		eq[7][i].in[0] <== m3_states_num[i];
		eq[7][i].in[1] <== 6;
		and[7][i] = AND();
		and[7][i].a <== states[i][7];
		and[7][i].b <== eq[7][i].out;
		states[i+1][8] <== and[7][i].out;
		//string compare: 5
		eq[8][i] = IsEqual();
		eq[8][i].in[0] <== m3_states_num[i];
		eq[8][i].in[1] <== 5;
		and[8][i] = AND();
		and[8][i].a <== states[i][8];
		and[8][i].b <== eq[8][i].out;
		states[i+1][9] <== and[8][i].out;
		//string compare: 4
		eq[9][i] = IsEqual();
		eq[9][i].in[0] <== m3_states_num[i];
		eq[9][i].in[1] <== 4;
		and[9][i] = AND();
		and[9][i].a <== states[i][9];
		and[9][i].b <== eq[9][i].out;
		states[i+1][10] <== and[9][i].out;
		//string compare: 3
		eq[10][i] = IsEqual();
		eq[10][i].in[0] <== m3_states_num[i];
		eq[10][i].in[1] <== 3;
		and[10][i] = AND();
		and[10][i].a <== states[i][10];
		and[10][i].b <== eq[10][i].out;
		states[i+1][11] <== and[10][i].out;
		//string compare: 2
		eq[11][i] = IsEqual();
		eq[11][i].in[0] <== m3_states_num[i];
		eq[11][i].in[1] <== 2;
		and[11][i] = AND();
		and[11][i].a <== states[i][11];
		and[11][i].b <== eq[11][i].out;
		states[i+1][12] <== and[11][i].out;
		//string compare: 1
		eq[12][i] = IsEqual();
		eq[12][i].in[0] <== m3_states_num[i];
		eq[12][i].in[1] <== 1;
		and[12][i] = AND();
		and[12][i].a <== states[i][12];
		and[12][i].b <== eq[12][i].out;
		states[i+1][13] <== and[12][i].out;
		//string compare: 0
		eq[13][i] = IsEqual();
		eq[13][i].in[0] <== m3_states_num[i];
		eq[13][i].in[1] <== 0;
		//string compare: 1
		eq[14][i] = IsEqual();
		eq[14][i].in[0] <== m3_states_num[i];
		eq[14][i].in[1] <== 1;
		and[13][i] = AND();
		and[13][i].a <== states[i][13];
		multi_or[0][i] = MultiOR(2);
		multi_or[0][i].in[0] <== eq[13][i].out;
		multi_or[0][i].in[1] <== eq[14][i].out;
		and[13][i].b <== multi_or[0][i].out;
		//string compare: 0
		eq[15][i] = IsEqual();
		eq[15][i].in[0] <== m3_states_num[i];
		eq[15][i].in[1] <== 0;
		//string compare: 1
		eq[16][i] = IsEqual();
		eq[16][i].in[0] <== m3_states_num[i];
		eq[16][i].in[1] <== 1;
		and[14][i] = AND();
		and[14][i].a <== states[i][14];
		multi_or[1][i] = MultiOR(2);
		multi_or[1][i].in[0] <== eq[15][i].out;
		multi_or[1][i].in[1] <== eq[16][i].out;
		and[14][i].b <== multi_or[1][i].out;
		multi_or[2][i] = MultiOR(2);
		multi_or[2][i].in[0] <== and[13][i].out;
		multi_or[2][i].in[1] <== and[14][i].out;
		states[i+1][14] <== multi_or[2][i].out;
	}
	signal final_state_sum[msg_bytes+1];
	component check_accepted[msg_bytes+1];
	check_accepted[0] = MultiOR(1);
	check_accepted[0].in[0] <== states[0][14];
	final_state_sum[0] <== check_accepted[0].out;
	for (var i = 1; i <= msg_bytes; i++) {
		check_accepted[i] = MultiOR(1);
		check_accepted[i].in[0] <== states[i][14] ;
		final_state_sum[i] <== final_state_sum[i-1] + check_accepted[i].out;
	}
	entire_count <== final_state_sum[msg_bytes];
	signal reveal[msg_bytes];
	component or_track[msg_bytes][0];
	for (var i = 0; i < msg_bytes; i++) {
	}
	
	for (var i = 0; i < msg_bytes; i++) {
		reveal[i] <== in[i] * or_track[i][group_idx].out;
	}
	
	var start_index = 0;
	var count = 0;
	
	component check_start[msg_bytes + 1];
	component check_match[msg_bytes + 1];
	component check_matched_start[msg_bytes + 1];
	component matched_idx_eq[msg_bytes];
	
	for (var i = 0; i < msg_bytes; i++) {
		if (i == 0) {
			count += or_track[0][group_idx].out;
		}
		else {
			check_start[i] = AND();
			check_start[i].a <== or_track[i][group_idx].out;
			check_start[i].b <== 1 - or_track[i-1][group_idx].out;
			count += check_start[i].out;
	
			check_match[i] = IsEqual();
			check_match[i].in[0] <== count;
			check_match[i].in[1] <== match_idx + 1;
	
			check_matched_start[i] = AND();
			check_matched_start[i].a <== check_match[i].out;
			check_matched_start[i].b <== check_start[i].out;
			start_index += check_matched_start[i].out * i;
		}
	
		matched_idx_eq[i] = IsEqual();
		matched_idx_eq[i].in[0] <== or_track[i][group_idx].out * count;
		matched_idx_eq[i].in[1] <== match_idx + 1;
	}
	
	component match_start_idx[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		match_start_idx[i] = IsEqual();
		match_start_idx[i].in[0] <== i;
		match_start_idx[i].in[1] <== start_index;
	}
	
	signal reveal_match[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		reveal_match[i] <== matched_idx_eq[i].out * reveal[i];
	}
	
	for (var j = 0; j < reveal_bytes; j++) {
		reveal_shifted_intermediate[j][j] <== 0;
		for (var i = j + 1; i < msg_bytes; i++) {
			reveal_shifted_intermediate[j][i] <== reveal_shifted_intermediate[j][i - 1] + match_start_idx[i-j].out * reveal_match[i];
		}
		reveal_shifted[j] <== reveal_shifted_intermediate[j][msg_bytes - 1];
	}
	
	group_match_count <== count;
	start_idx <== start_index;
}

//Note: in = text, match_idx = occurence of that subgroup matching we want to match, KbankAccountRegex(max_msg_bytes, max_reveal_bytes, group_idx)

//where max_msg_bytes = maximum byte we allow on input text, max_reveal_bytes = maximum byte we allow on revealing the submatch, group_idx = to tell which submatch we are interested in.
