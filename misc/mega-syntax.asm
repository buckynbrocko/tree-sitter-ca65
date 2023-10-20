;;; ;;; ;;; ;;; ;;;
;;; Expressions
;;; ;;; ;;; ;;; ;;;

;;; Number Literals
tree-sitter-expression-block-start
%0
%1
%00
%01
%10
%11
0
1
00
01
10
11
1234
$0
$1
$A
$B
$C
$D
$E
$F
$00
$01
$10
$11
$A0
$0A
$AA
$BB
$CC
$DD
$EE
$FF
$DEAD
$BEEF
tree-sitter-expression-block-end


;;; String Literals
tree-sitter-expression-block-start
"hello world"
"this string has an escape sequence \n"
tree-sitter-expression-block-end

;;; ;;; ;;; ;;; ;;;
;;; Mnemonics
;;; ;;; ;;; ;;; ;;;

;;; Standard Mnemonics
adc
and
asl
bcc
bcs
beq
bit
bmi
bne
bpl
brk
bvc
bvs
clc
cld
cli
clv
cmp
cpx
cpy
dec
dex
dey
eor
inc
inx
iny
jmp
jsr
lda
ldx
ldy
lsr
nop
ora
pha
php
pla
plp
rol
ror
rti
rts
sbc
sec
sed
sei
sta
stx
sty
tax
tay
tsx
txa
txs
tya

;;; 65816 Mode Mnemonics
cpa
dea
ina
swa
tad
tas
tda
tsa
mvn
mvp

;;; 6502X Mode Mnemonics
alr
anc
arr
axs
dcp
isc
las
lax
rla
rra
sax
slo
sre


;;; ;;; ;;; ;;; ;;;
;;; Addressing Modes
;;; ;;; ;;; ;;; ;;;

lda 0
lda 1
lda 01
lda $01
lda $10
lda $DE
lda $AD
lda a_label

lda #0
lda #1
lda #01
lda #$01
lda #$10
lda #$DE
lda #$AD
lda #a_label

lda 0, x
lda 1, x
lda 01, x
lda $01, x
lda $10, x
lda $DE, x
lda $AD, x

lda 0, y
lda 1, y
lda 01, y
lda $01, y
lda $10, y
lda $DE, y
lda $AD, y

lda (0, x)
lda (1, x)
lda (01, x)
lda ($01, x)
lda ($10, x)
lda ($DE, x)
lda ($AD, x)

lda [0, x]
lda [1, x]
lda [01, x]
lda [$01, x]
lda [$10, x]
lda [$DE, x]
lda [$AD, x]

lda (0), y
lda (1), y
lda (01), y
lda ($01), y
lda ($10), y
lda ($DE), y
lda ($AD), y

lda [0], y
lda [1], y
lda [01], y
lda [$01], y
lda [$10], y
lda [$DE], y
lda [$AD], y

;;; ;;; ;;; ;;; ;;;
;;; Symbols & Labels
;;; ;;; ;;; ;;; ;;;

$ = $BEEF
* = $DEAD

Label:                      ; A label and a comment
    lda     #$20            ; A 6502 instruction plus comment
L1: ldx     #$20            ; Same with label
L2: .byte   "Hello world"   ; Label plus control command
    mymac   $20             ; Macro expansion
    MySym = 3 * L1          ; Symbol definition
MaSym = Label               ; Another symbol


:
: bra :+
: bra :++
: bra :-
: bra :--
:

GlobalLabel:  lda    #$00
        ldy    #$20
@LocalLabel:  sta    Mem,y
        dey
        bne    @LocalLabel
        rts
LocalLabelIsNoLongerValid:

;;; ;;; ;;; ;;; ;;;
;;; Pseudo Variables
;;; ;;; ;;; ;;; ;;;

;;; ;;; ;;; ;;; ;;;
;;; Pseudo Functions
;;; ;;; ;;; ;;; ;;;

;;; ;;; ;;; ;;; ;;;
;;; Control Commands
;;; ;;; ;;; ;;; ;;;

;;;assert
.assert 10 = $0A, warning
.assert 10 = $0A, ldwarning
.assert 10 = $0A, error
.assert 10 = $0A, lderror
.assert 10 = $0A, warning, "The world is on fire. Everybody panic."
.assert 10 = $0A, ldwarning, "The world is on fire. Everybody panic."
.assert 10 = $0A, error, "The world is on fire. Everybody panic."
.assert 10 = $0A, lderror, "The world is on fire. Everybody panic."

;;; .condes
.condes some_symbol, 0
.condes some_symbol, 1
.condes some_symbol, 2
.condes some_symbol, 3
.condes some_symbol, 4
.condes some_symbol, 5
.condes some_symbol, 6
.condes some_symbol, constructor
.condes some_symbol, destructor
.condes some_symbol, 0, "How much wood could a woodchuck chuck?"
.condes some_symbol, 1, "How much wood could a woodchuck chuck?"
.condes some_symbol, 2, "How much wood could a woodchuck chuck?"
.condes some_symbol, 3, "How much wood could a woodchuck chuck?"
.condes some_symbol, 4, "How much wood could a woodchuck chuck?"
.condes some_symbol, 5, "How much wood could a woodchuck chuck?"
.condes some_symbol, 6, "How much wood could a woodchuck chuck?"
.condes some_symbol, constructor, "How much wood could a woodchuck chuck?"
.condes some_symbol, destructor, "How much wood could a woodchuck chuck?"

;; .enum
.enum enumerational
    FOO = 1
    BAR = 2
    BAZ = 3
.endenum

;;; .feature
.feature at_in_identifiers on
.feature at_in_identifiers off
.feature at_in_identifiers +
.feature at_in_identifiers -
.feature bracket_as_indirect on
.feature bracket_as_indirect off
.feature bracket_as_indirect +
.feature bracket_as_indirect -
.feature c_comments on
.feature c_comments off
.feature c_comments +
.feature c_comments -
.feature dollar_in_identifiers on
.feature dollar_in_identifiers off
.feature dollar_in_identifiers +
.feature dollar_in_identifiers -
.feature dollar_is_pc on
.feature dollar_is_pc off
.feature dollar_is_pc +
.feature dollar_is_pc -
.feature force_range on
.feature force_range off
.feature force_range +
.feature force_range -
.feature labels_without_colons on
.feature labels_without_colons off
.feature labels_without_colons +
.feature labels_without_colons -
.feature leading_dot_in_identifiers on
.feature leading_dot_in_identifiers off
.feature leading_dot_in_identifiers +
.feature leading_dot_in_identifiers -
.feature long_jsr_jmp_rts on
.feature long_jsr_jmp_rts off
.feature long_jsr_jmp_rts +
.feature long_jsr_jmp_rts -
.feature loose_char_term on
.feature loose_char_term off
.feature loose_char_term +
.feature loose_char_term -
.feature loose_string_term on
.feature loose_string_term off
.feature loose_string_term +
.feature loose_string_term -
.feature missing_char_term on
.feature missing_char_term off
.feature missing_char_term +
.feature missing_char_term -
.feature org_per_seg on
.feature org_per_seg off
.feature org_per_seg +
.feature org_per_seg -
.feature pc_assignment on
.feature pc_assignment off
.feature pc_assignment +
.feature pc_assignment -
.feature string_escapes on
.feature string_escapes off
.feature string_escapes +
.feature string_escapes -
.feature ubiquitous_idents on
.feature ubiquitous_idents off
.feature ubiquitous_idents +
.feature ubiquitous_idents -
.feature underline_in_numbers on
.feature underline_in_numbers off
.feature underline_in_numbers +
.feature underline_in_numbers -

;;; individual feature commands
.autoimport +
.autoimport -
.autoimport on
.autoimport off
.case +
.case -
.case on
.case off
.debuginfo +
.debuginfo -
.debuginfo on
.debuginfo off
.linecont +
.linecont -
.linecont on
.linecont off
.list +
.list -
.list on
.list off
.smart +
.smart -
.smart on
.smart off

;;; .fileopt
.fileopt author "John Jacob Jinkleheimer Smith"
.fileopt comment "This is a comment"
.fileopt compiler "cc65/ca65"
.fopt author "John Jacob Jinkleheimer Smith"
.fopt comment "This is a comment"
.fopt compiler "cc65/ca65"

;;; conditionals
.if 10 = $10
    .out("Shouldn't happen")
.elseif (10 > $10)
    .out("Also shouldn't happen")
.else
    .out("This is the only possible option")
.endif

;;; macros
.macro macro_name arg, another_arg
    lda arg
    ldx another_arg
    arg
    another_arg
.endmacro

.macro macro_name arg
    lda arg
    arg
.endmacro

macro_name   $20

;;; repeats
.repeat 1
    rts
.endrepeat

.repeat $10
    rts
.endrepeat

.repeat 2
    rts
.endrep

.repeat $20
    rts
.endrep

;;;scope
.scope no_scope_360
    .out .string($B00B)
.endscope

;;; structs/unions
.struct a_struct_name
    member_name .byte
    another_member_name .word
.endstruct

.union a_union_name
    member_name .byte
    another_member_name .word
.endunion



;;; ;;; ;;; ;;; ;;;
;;; Predefined Constants
;;; ;;; ;;; ;;; ;;;

;;; ;;; ;;; ;;; ;;;
;;; Optional Behavior
;;; ;;; ;;; ;;; ;;;

; --ingore-case
; --relax-checks
; --smart-mode
