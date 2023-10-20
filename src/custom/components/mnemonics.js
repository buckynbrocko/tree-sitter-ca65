const mnemonics = {
    common: [
        "adc",
        "and",
        "asl",
        "bbr0",
        "bbr1",
        "bbr2",
        "bbr3",
        "bbr4",
        "bbr5",
        "bbr6",
        "bbr7",
        "bbs0",
        "bbs1",
        "bbs2",
        "bbs3",
        "bbs4",
        "bbs5",
        "bbs6",
        "bbs7",
        "bcc",
        "bcs",
        "beq",
        "bit",
        "bmi",
        "bne",
        "bpl",
        "brk",
        "bvc",
        "bvs",
        "clc",
        "cld",
        "cli",
        "clv",
        "cmp",
        "cpx",
        "cpy",
        "dec",
        "dex",
        "dey",
        "eor",
        "inc",
        "inx",
        "iny",
        "jmp",
        "jsr",
        "lda",
        "ldx",
        "ldy",
        "lsr",
        "nop",
        "ora",
        "pha",
        "php",
        "pla",
        "plp",
        "rmb0",
        "rmb1",
        "rmb2",
        "rmb3",
        "rmb4",
        "rmb5",
        "rmb6",
        "rmb7",
        "rol",
        "ror",
        "rti",
        "rts",
        "sbc",
        "sec",
        "sed",
        "sei",
        "smb0",
        "smb1",
        "smb2",
        "smb3",
        "smb4",
        "smb5",
        "smb6",
        "smb7",
        "sta",
        "stx",
        "sty",
        "tax",
        "tay",
        "tsx",
        "txa",
        "txs",
        "tya",
    ],
    _65816Mode: [
        "cpa",
        "dea",
        "ina",
        "swa",
        "tad",
        "tas",
        "tda",
        "tsa",
        "mvn",
        "mvp",
    ],
    _6502XMode: [
        "alr",
        "anc",
        "arr",
        "axs",
        "dcp",
        "isc",
        "las",
        "lax",
        "rla",
        "rra",
        "sax",
        "slo",
        "sre",
    ],
    _4510Mode: [
        "lbcc",
        "lbcs",
        "lbeq",
        "lbit",
        "lbmi",
        "lbne",
        "lbpl",
        "lbrk",
        "lbvc",
        "lbvs",
    ],
};

mnemonics.all = [
    ...mnemonics.common,
    ...mnemonics._4510Mode,
    ...mnemonics._6502XMode,
    ...mnemonics._65816Mode,
]

module.exports = mnemonics;
