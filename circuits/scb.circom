pragma circom 2.1.5;

include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "./components/scb_promptpay_id_regex.circom";

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

    // // Body reveal vars
    // var max_twitter_len = 21;
    // var max_twitter_packed_bytes = count_packed(max_twitter_len, pack_size); // ceil(max_num_bytes / 7)
    // signal input twitter_username_idx;
    // signal output reveal_twitter_packed[max_twitter_packed_bytes];
    
    // // TWITTER REGEX: 328,044 constraints
    // // This computes the regex states on each character in the email body. For new emails, this is the
    // // section that you want to swap out via using the zk-regex library.
    // signal (twitter_regex_out, twitter_regex_reveal[max_body_bytes]) <== TwitterResetRegex(max_body_bytes)(in_body_padded);
    // // This ensures we found a match at least once (i.e. match count is not zero)
    // signal is_found_twitter <== IsZero()(twitter_regex_out);
    // is_found_twitter === 0;

    // // PACKING: 16,800 constraints (Total: 3,115,057)
    // reveal_twitter_packed <== ShiftAndPackMaskedStr(max_body_bytes, max_twitter_len, pack_size)(twitter_regex_reveal, twitter_username_idx);

    var account_len = 16; // 20 for id, 16 for phone
    var num_bytes_account_packed = count_packed(account_len, pack_size); // ceil(max_num_bytes / 7)
    signal input account_idx;
    signal output reveal_account_packed[num_bytes_account_packed];

    signal (total_occurence, account_regex_reveal[max_body_bytes]) <== SCBPromptPayIdRegex(max_body_bytes)(in_body_padded);
    signal is_found_account <== IsZero()(total_occurence);
    is_found_account === 0;

    reveal_account_packed <== ShiftAndPackMaskedStr(max_body_bytes, account_len, pack_size)(account_regex_reveal, account_idx);
}

// In circom, all output signals of the main component are public (and cannot be made private), the input signals of the main component are private if not stated otherwise using the keyword public as above. The rest of signals are all private and cannot be made public.
// This makes pubkey_hash and reveal_twitter_packed public. hash(signature) can optionally be made public, but is not recommended since it allows the mailserver to trace who the offender is.

// TODO: Update deployed contract and zkey to reflect this number, as it the currently deployed contract uses 7
// Args:
// * max_header_bytes = 1024 is the max number of bytes in the header
// * max_body_bytes = 1536 is the max number of bytes in the body after precomputed slice
// * n = 121 is the number of bits in each chunk of the pubkey (RSA parameter)
// * k = 17 is the number of chunks in the pubkey (RSA parameter). Note 121 * 17 > 2048.
// * pack_size = 31 is the number of bytes that can fit into a 255ish bit signal (can increase later)
// component main { public [ address ] } = SCBVerifier(1024, 1536, 121, 17, 31);
component main { public [ address ] } = SCBVerifier(640, 3840, 121, 17, 31);
