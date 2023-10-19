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
;;; Symbols & Labels
;;; ;;; ;;; ;;; ;;;

Label:                      ; A label and a comment
    lda     #$20            ; A 6502 instruction plus comment
L1: ldx     #$20            ; Same with label
L2: .byte   "Hello world"   ; Label plus control command
    mymac   $20             ; Macro expansion
    MySym = 3 * L1          ; Symbol definition
MaSym = Label               ; Another symbol

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
