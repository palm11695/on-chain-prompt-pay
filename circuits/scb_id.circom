pragma circom 2.1.5;

include "./scb_base.circom";

component main { public [ address ] } = SCBVerifier(640, 4096, 121, 17, 31, 20);