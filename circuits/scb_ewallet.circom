pragma circom 2.1.5;

include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "./components/scb_ewallet_regex.circom";

template SCBVerifier(max_header_bytes, max_body_bytes, n, k, pack_size) {
    signal input in_padded[max_header_bytes]; // prehashed email data, includes up to 512 + 64? bytes of padding pre SHA256, and padded with lots of 0s at end after the length
    signal input pubkey[k]; // rsa pubkey, verified with smart contract + DNSSEC proof. split up into k parts of n bits each.
    signal input signature[k]; // rsa signature. split up into k parts of n bits each.
    signal input in_len_padded_bytes; // length of in email data including the padding, which will inform the sha256 block length

    // Identity commitment variables
    // (note we don't need to constrain the + 1 due to https://geometry.xyz/notebook/groth16-malleability)
    signal input address;
    signal input body_hash_idx;
    signal input precomputed_sha[32];
    signal input in_body_padded[max_body_bytes];
    signal input in_body_len_padded_bytes;

    signal output pubkey_hash;

    // TODO: re-enable body hash check
    component EV = EmailVerifier(max_header_bytes, max_body_bytes, n, k, 1);
    EV.in_padded <== in_padded;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.in_len_padded_bytes <== in_len_padded_bytes;
    // EV.body_hash_idx <== body_hash_idx;
    // EV.precomputed_sha <== precomputed_sha;
    // EV.in_body_padded <== in_body_padded;
    // EV.in_body_len_padded_bytes <== in_body_len_padded_bytes;

    pubkey_hash <== EV.pubkey_hash;

    var account_len = 21;
    var num_bytes_account_packed = count_packed(account_len, pack_size); // ceil(max_num_bytes / 7)
    signal input account_idx;
    signal output reveal_account_packed[num_bytes_account_packed];

    signal (total_occurence, account_regex_reveal[max_body_bytes]) <== SCBEWalletRegex(max_body_bytes)(in_body_padded);
    signal is_found_account <== IsZero()(total_occurence);
    is_found_account === 0;

    reveal_account_packed <== ShiftAndPackMaskedStr(max_body_bytes, account_len, pack_size)(account_regex_reveal, account_idx);
}

component main { public [ address ] } = SCBVerifier(640, 4096, 121, 17, 31);