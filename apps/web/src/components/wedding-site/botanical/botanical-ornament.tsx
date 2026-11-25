import type { ReactNode } from "react";

/** Ботанічні орнаменти з макета Figma «Ботанічний v2» (botanical-ornaments). Колір — через currentColor. */

export type BotanicalOrnamentName = "lily" | "emblem" | "olive" | "wild" | "lavender";

type Props = {
  name: BotanicalOrnamentName;
  className?: string;
};

const ORNAMENTS: Record<BotanicalOrnamentName, { viewBox: string; body: ReactNode }> = {
  lily: {
    viewBox: "0 0 900 1100",
    body: (
      <>
        <path d="M433 1034C421 901 390 772 351 642C313 514 291 411 278 322M441 1032C430 891 398 770 359 640C320 510 299 408 286 323" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M447 1030C456 860 483 727 541 600C576 523 607 478 621 428M454 1031C464 862 491 731 548 603C584 524 615 480 628 429" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M439 998C470 816 473 638 482 457C487 359 497 291 509 235M445 1000C477 817 480 638 489 458C494 360 503 292 515 235" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M491 752C584 655 632 496 672 338L696 266M497 755C591 655 639 497 679 340L701 269" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M453 1010C519 902 610 807 671 711M459 1012C526 904 617 809 677 714" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M420 933C351 916 291 862 260 793C228 724 217 682 170 647C232 660 279 720 307 775C343 844 380 890 420 933Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M412 924C323 859 288 714 179 653M275 784C292 799 310 818 321 842M302 765C311 791 325 815 338 832" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M457 958C484 877 535 841 580 810C638 769 686 740 708 687C712 760 667 821 612 850C548 884 493 903 457 958Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M466 944C525 865 657 840 703 705M548 869C571 863 594 859 615 845M631 794C611 820 586 837 566 847" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M371 711.001C311 686.001 272 641.001 240 585.001C208 529.001 169 491.001 120 476.001C185 467.001 242 500.001 277 551.001C312 601.001 334 659.001 371 711.001Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M361 699C296 641 268 512 130 479M226 534C248 563 273 598 289 622M277 567C287 580 299 601 305 619" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M381 744C389 679 414 617 425 559C437 496 432 451 418 408C455 448 466 504 453 563C439 626 405 678 381 744Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M385 728C415 634 455 516 423 420M420 606C434 585 442 560 445 540" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M528 637C583 605 629 586 681 573C736 558 774 526 791 480C800 538 766 586 720 607C662 633 593 619 528 637Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M542 634C622 603 748 621 788 494M657 607C690 602 714 595 732 585M706 569C688 584 665 594 644 598" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M487 521C524 489 544 451 547 408C549 371 537 344 543 311C516 333 502 372 506 408C509 451 499 487 487 521Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M492 507C532 435 513 382 539 324" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M319 512C287 469 249 446 210 425C172 405 149 379 139 351C136 395 159 429 195 448C241 471 286 478 319 512Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M309 502C255 462 173 450 142 362" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M635 463C686 429 733 423 762 388C778 368 784 344 783 322C804 371 780 409 742 426C703 443 666 445 635 463Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M645 458C702 430 780 423 784 336" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M576 840C566 797 571 755 588 720C600 694 605 671 602 649C625 683 615 719 600 754C585 788 580 816 576 840Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M577.999 827C573.999 769 610.999 716 603.999 662" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M277.998 314C253.998 287 223.998 248 215.998 206C207.998 171 218.998 137 241.998 115C245.998 148 264.998 163 281.998 186C306.998 219 304.998 267 290.998 307" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M278 310C239 288 202 284 168 265C135 246 115 220 103 186C137 207 168 195 198 203C240 213 265 258 278 310Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M289 309.001C291 261.001 315 219.001 351 194.001C378 175.001 404 173.001 430 180.001C401 195.001 400 222.001 378 246.001C354 274.001 320 290.001 289 309.001Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M282 313.001C243 306.001 215 317.001 188 336.001C165 352.001 146 357.001 125 350.001C139 375.001 166 385.001 193 376.001C234 363.001 257 334.001 282 313.001Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M289 311.002C319 290.002 345 278.002 375 284.002C404 291.002 413 314.002 431 322.002C408 325.002 390 338.002 369 336.002C335 334.002 311 315.002 289 311.002Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M284.001 313C269.001 337 261.001 363 271.001 392C280.001 415 297.001 426 315.001 423C299.001 410 306.001 391 308.001 374C312.001 349 301.001 327 284.001 313Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M280 292C254 244 237 190 242 126M271 261C263 224 250 203 244 181M224 189C224 221 242 255 256 272M265 295C219 251 160 239 115 199M245 269C210 251 180 246 157 231M299 290C334 255 379 216 417 185M328 274C350 257 371 239 380 223M270 319C221 332 183 376 140 360M248 334C224 347 207 363 185 368M300 309C345 301 387 320 418 322M326 303C354 293 374 298 388 307M284 326C276 363 290 392 306 415M299 355C300 374 293 386 297 397" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M281 311C272 280 255 257 239 245M284 310C285 275 282 244 274 224M288 309C303 280 317 259 335 249M280 311C257 290 238 283 218 282M287 311C301 293 321 284 344 280" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M231.999 242C228.999 236 233.999 233 239.999 237C246.999 242 248.999 249 244.999 251C240.999 253 235.999 247 231.999 242ZM268.999 225C264.999 216 265.999 209 269.999 208C274.999 207 279.999 221 277.999 226C275.999 230 270.999 230 268.999 225ZM328.999 247C331.999 241 341.999 235 345.999 238C349.999 242 340.999 251 334.999 253C330.999 254 326.999 251 328.999 247ZM210.999 283C203.999 280 204.999 275 210.999 274C217.999 274 226.999 278 225.999 282C224.999 286 217.999 285 210.999 283ZM338.999 279C342.999 274 354.999 270 357.999 274C360.999 279 349.999 284 343.999 285C339.999 285 336.999 283 338.999 279Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M259 286L255 280M251 274L248 269M266 278L264 271M301 280L305 274M310 270L315 265M313 289L319 286M245 304L238 302M237 298L232 295M265 336L262 342M305 326L310 329" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M509 241C493 228 480 210 476 190L491 197L500 185L511 198L526 184L528 201L545 194C538 216 525 233 515 242L509 241Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M511 234L502 205M516 231L525 206" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M477 199C457 199 446 190 435 178L421 180L424 166L410 160L419 149L406 137L421 131L416 115H432L430 99L448 103L453 86L468 94L477 77L489 86L502 70L514 82L529 74L536 90L554 84L557 101L576 99L573 117L590 122L581 137L595 149L580 158L584 175L567 177L565 192L546 190C538 206 521 211 503 207C493 209 483 205 477 199Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M476 197C464 183 457 172 458 160L443 157L451 145L438 136L454 130L450 117L466 120L472 105L486 113L497 96L508 108L522 99L528 114L545 108L543 126L561 127L554 141L569 149L557 159L563 172C548 175 537 188 531 199" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M492 200C482 190 477 179 478 169L466 164L478 154L470 143L487 140V125L501 130L512 118L520 133L535 130L532 145L545 153L534 163L538 177C524 180 514 192 510 201" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M497 186L493 173L485 167L498 157L493 147L508 151L515 139L522 151L530 156L519 166L521 177L508 175L503 188" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M437 175C443 179 449 180 456 181M427 139L441 142M436 111L443 122M465 95L470 103M492 86L497 94M550 97L547 108M574 124L563 133M577 162L566 165M548 183L537 191M461 145L466 151M479 121L484 132M520 113L521 124M500 137L506 143M481 183L486 192M514 191L524 183" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M621.001 420C589.001 389 570.001 355 573.001 324C576.001 298 592.001 282 599.001 260C607.001 287 624.001 300 633.001 322C647.001 355 632.001 393 621.001 420Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M619 420C582 401 552 385 535 360C517 335 515 310 497 293C529 298 559 308 578 330C598 352 609 385 619 420Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M628 418C637 375 662 344 696 331C730 317 753 329 780 315C765 349 744 373 711 383C681 392 653 403 628 418Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M619 419.999C585 404.999 558 410.999 532 426.999C511 440.999 494 441.999 477 433.999C488 457.999 508 467.999 531 463.999C565 457.999 589 431.999 619 419.999Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M626 421C649 405 677 398 703 407C728 417 743 441 766 444C741 457 716 455 694 447C667 437 650 424 626 421Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M621.999 422C600.999 442 590.999 466 596.999 489C601.999 508 617.999 520 637.999 518C625.999 505 635.999 490 639.999 474C645.999 451 636.999 435 621.999 422Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M621 402C618 356 592 314 599 273M610 378C593 355 585 334 588 316M626 372C628 348 622 332 615 322M608 399C577 356 545 322 508 301M581 357C559 344 547 328 535 319M639 406C687 366 735 363 769 326M660 376C690 346 719 343 740 340M652 397C674 385 693 380 712 374M607 420C557 423 532 464 490 445M636 418C684 414 715 453 753 446M683 419C701 421 712 434 724 437M619 436C605 467 611 499 630 511M630 453C632 473 619 489 625 501" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M622 420C611 392 591 376 572 368M623 418C623 387 619 366 611 350M627 418C644 390 662 374 681 366M618 419C595 407 579 401 560 401M628 420C651 405 671 401 692 402" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M565.001 369.002C559.001 367.002 557.001 362.002 561.001 360.002C566.001 357.002 579.001 364.002 579.001 369.002C578.001 374.002 571.001 371.002 565.001 369.002ZM607.001 351.002C603.001 345.002 600.001 336.002 604.001 334.002C609.001 331.002 616.001 344.002 615.001 350.002C614.001 355.002 610.001 354.002 607.001 351.002ZM676.001 365.002C681.001 358.002 690.001 355.002 693.001 359.002C696.001 363.002 685.001 372.002 680.001 372.002C676.001 373.002 673.001 369.002 676.001 365.002ZM551.001 403.002C545.001 401.002 545.001 397.002 550.001 395.002C556.001 393.002 569.001 398.002 568.001 402.002C567.001 406.002 558.001 405.002 551.001 403.002ZM686.001 402.002C690.001 398.002 702.001 396.002 705.001 400.002C707.001 405.002 695.001 408.002 690.001 407.002C686.001 407.002 684.001 405.002 686.001 402.002Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M602 402L597 397M594 390L590 385M610 392L608 386M641 393L645 388M650 387L655 383M654 400L660 397M589 418L583 419M604 443L601 449M643 430L649 433" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M695.001 272C678.001 258 676.001 238 686.001 215C696.001 192 723.001 177 735.001 156C739.001 181 743.001 207 733.001 230C724.001 249 713.001 262 702.001 274L695.001 272Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M699 267C693 239 715 190 735 156M703 266C722 227 733 200 735 166M690 254C683 233 696 211 708 196" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M695 276C684 271 680 260 678 249L692 260L697 250L704 263L717 257C712 270 706 278 695 276Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M667 718C653 708 647 691 649 677L660 683L669 674L675 685L691 679L688 691L702 690C695 705 682 714 674 721L667 718Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M651 686C636 682 625 675 620 662H607L612 649L599 642L610 632L604 618H621L620 603L635 607L642 593L656 601L668 588L679 599L695 590L700 606L718 600L720 617L737 619L730 633L745 643L733 653L739 667L723 671L724 684L708 683C696 696 678 698 666 691L651 686Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M653 684C641 672 637 659 640 648L627 645L636 634L629 624H646L651 611L663 621L676 607L684 622L700 615L701 631L716 632L708 645L720 652L709 662L712 674C695 673 684 685 679 690" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M664 679L652 664L659 653L649 644L665 642V628L679 637L691 629L694 643L706 648L694 658L697 670L684 669L675 683" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M669 665L666 655L676 650L675 640L687 648L683 659L674 660M669 710L661 694M676 709L686 696" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M618 651L629 657M617 628L627 632M638 612L644 620M663 602L667 612M697 605L695 616M727 624L716 630M729 659L719 663M704 680L693 686M645 666L651 672M681 625L683 632" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M215 169C211 182 214 201 217 213M321 215C334 202 349 192 363 187M152 379C166 383 178 382 188 379M313 394C312 405 314 413 320 417M569 322C565 339 570 357 577 371M706 326C722 323 737 326 748 323M597 495C603 513 615 522 626 522M274 562C292 584 305 612 315 635M242 753C250 775 261 797 273 816M444 478C450 501 449 523 445 540M739 589C757 579 770 565 779 549M605 856C581 869 560 876 543 883M436 1009L439 1038M450 1008V1041" strokeWidth="0.65" strokeLinecap="round" stroke="currentColor"/>
      </>
    ),
  },
  emblem: {
    viewBox: "0 0 360 300",
    body: (
      <>
        <path d="M180 263C179 220 181 165 180 116" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180 235C165 211 162 180 167 157C177 180 179 208 180 235Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180 235C195 211 198 180 193 157C183 180 181 208 180 235Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180 252C133 235 92 204 77 162C70 143 67 126 65 109" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M147 236C126 237 107 227 97 210C118 210 136 220 147 236Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M117.001 216C102.001 198 100.001 180 105.001 165C118.001 179 121.001 198 117.001 216Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M96 193C74 190 56 175 49 158C70 161 86 175 96 193Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M80.0001 169C77.0001 150 83.0001 132 94.0001 122C98.0001 140 91.0001 158 80.0001 169Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M71 142C54 135 44 119 43 103C59 112 68 126 71 142Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M64.9985 110C55.9985 95 56.9985 80 62.9985 68C70.9985 81 72.9985 96 64.9985 110Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180 252C227 235 268 204 283 162C290 143 293 126 295 109" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M213 236C234 237 253 227 263 210C242 210 224 220 213 236Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M243.002 216C258.002 198 260.002 180 255.002 165C242.002 179 239.002 198 243.002 216Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M264 193C286 190 304 175 311 158C290 161 274 175 264 193Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M280 169C283 150 277 132 266 122C262 140 269 158 280 169Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M289 142C306 135 316 119 317 103C301 112 292 126 289 142Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M294.999 110C303.999 95 302.999 80 296.999 68C288.999 81 286.999 96 294.999 110Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M174.002 91C158.002 81 149.002 69 151.002 56C152.002 49 160.002 48 166.002 53" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M186 91C202 81 211 69 209 56C208 49 200 48 194 53" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180.002 94C170.002 82 163.002 67 165.002 53C166.002 46 173.002 42 175.002 36C177.002 32 183.002 32 185.002 36C187.002 42 194.002 46 195.002 53C197.002 67 190.002 82 180.002 94Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180.002 83C178.002 67 179.002 55 180.002 46" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M178.001 92.9981C164.001 80.9981 146.001 79.9981 134.001 86.9981C129.001 89.9981 128.001 95.9981 134.001 99.9981C138.001 102.998 141.001 100.998 145.001 104.998C150.001 110.998 160.001 108.998 166.001 102.998C171.001 98.9981 175.001 95.9981 178.001 92.9981Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M182 92.9981C196 80.9981 214 79.9981 226 86.9981C231 89.9981 232 95.9981 226 99.9981C222 102.998 219 100.998 215 104.998C210 110.998 200 108.998 194 102.998C189 98.9981 185 95.9981 182 92.9981Z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M178 94C171 100 166 113 170 122C172 128 177 125 180 128C183 125 188 128 190 122C194 113 189 100 182 94" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M180 101V117" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M169 92.0009C160 90.0009 150 91.0009 143 96.0009" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M191 92.0009C200 90.0009 210 91.0009 217 96.0009" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M112.998 76.5984C113.882 76.5984 114.598 75.8821 114.598 74.9984C114.598 74.1148 113.882 73.3984 112.998 73.3984C112.115 73.3984 111.398 74.1148 111.398 74.9984C111.398 75.8821 112.115 76.5984 112.998 76.5984Z" fill="currentColor"/>
        <path d="M246.998 76.5984C247.882 76.5984 248.598 75.8821 248.598 74.9984C248.598 74.1148 247.882 73.3984 246.998 73.3984C246.115 73.3984 245.398 74.1148 245.398 74.9984C245.398 75.8821 246.115 76.5984 246.998 76.5984Z" fill="currentColor"/>
        <path d="M137 146.5C137.828 146.5 138.5 145.828 138.5 145C138.5 144.172 137.828 143.5 137 143.5C136.172 143.5 135.5 144.172 135.5 145C135.5 145.828 136.172 146.5 137 146.5Z" fill="currentColor"/>
        <path d="M223 146.5C223.828 146.5 224.5 145.828 224.5 145C224.5 144.172 223.828 143.5 223 143.5C222.172 143.5 221.5 144.172 221.5 145C221.5 145.828 222.172 146.5 223 146.5Z" fill="currentColor"/>
        <path d="M179.997 274.697C180.936 274.697 181.697 273.936 181.697 272.997C181.697 272.058 180.936 271.297 179.997 271.297C179.058 271.297 178.297 272.058 178.297 272.997C178.297 273.936 179.058 274.697 179.997 274.697Z" fill="currentColor"/>
      </>
    ),
  },
  olive: {
    viewBox: "0 0 400 160",
    body: (
      <>
        <path d="M49 119C128 113 234 85 322 46C257 80 146 115 50 123L49 119Z" fill="currentColor"/>
        <path d="M108 111C84 103 76 80 73 61C94 72 108 90 108 111Z" fill="currentColor"/>
        <path d="M137 104.998C158 101.998 179 113.998 191 131.998C166 130.998 146 121.998 137 104.998Z" fill="currentColor"/>
        <path d="M180.999 93C159.999 81 152.999 56 153.999 34C173.999 51 183.999 71 180.999 93Z" fill="currentColor"/>
        <path d="M211 81.9991C234 79.9991 256 89.9991 270 106.999C244 108.999 223 98.9991 211 81.9991Z" fill="currentColor"/>
        <path d="M249.001 68C233.001 55 234.001 34 240.001 18C254.001 33 258.001 52 249.001 68Z" fill="currentColor"/>
        <path d="M279 57.9984C299 53.9984 320 61.9984 335 75.9984C311 80.9984 291 72.9984 279 57.9984Z" fill="currentColor"/>
        <path d="M307 53C313 36 332 26 351 25C343 42 326 52 307 53Z" fill="currentColor"/>
        <path d="M159 100C157 106 154.333 111 151 115M230 76C223.333 71.3333 218.667 65.3333 216 58" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor"/>
        <path d="M148 128C152.418 128 156 124.418 156 120C156 115.582 152.418 112 148 112C143.582 112 140 115.582 140 120C140 124.418 143.582 128 148 128Z" fill="currentColor"/>
        <path d="M214 60C218.418 60 222 56.4183 222 52C222 47.5817 218.418 44 214 44C209.582 44 206 47.5817 206 52C206 56.4183 209.582 60 214 60Z" fill="currentColor"/>
      </>
    ),
  },
  wild: {
    viewBox: "0 0 360 400",
    body: (
      <>
        <path d="M104 122C110 162 135 204 147 243C160 279 177 312 187 345" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M240 116C235 155 218 197 208 235C197 275 185 307 178 349" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M181.001 198C177.001 233 182.001 256 180.001 283C179.001 305 183.001 329 181.001 344" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M269 214C257 248 225 265 208 291C197 308 190 325 184 340" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M98.0016 100.998C90.0016 89.9984 86.0016 76.9984 92.0016 68.9984C97.0016 60.9984 111.002 61.9984 117.002 68.9984C124.002 76.9984 119.002 90.9984 114.002 101.998C127.002 90.9984 141.002 86.9984 149.002 94.9984C157.002 101.998 154.002 113.998 146.002 118.998C138.002 123.998 126.002 122.998 117.002 121.998C130.002 130.998 140.002 141.998 134.002 150.998C129.002 159.998 116.002 158.998 110.002 150.998C105.002 143.998 104.002 134.998 103.002 128.998C99.0016 142.998 94.0016 155.998 84.0016 156.998C74.0016 157.998 68.0016 148.998 73.0016 139.998C77.0016 130.998 86.0016 124.998 94.0016 120.998C80.0016 126.998 65.0016 125.998 62.0016 115.998C59.0016 106.998 66.0016 97.9984 75.0016 98.9984C84.0016 97.9984 92.0016 102.998 98.0016 107.998" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M103.003 107.998C109.003 104.998 115.003 109.998 114.003 115.998C114.003 122.998 104.003 124.998 100.003 119.998C96.0029 115.998 98.0029 109.998 103.003 107.998Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M232 96.001C221 85.001 217 73.001 223 65.001C229 57.001 242 59.001 247 66.001C253 74.001 247 87.001 244 96.001C255 86.001 269 81.001 277 88.001C286 96.001 282 107.001 273 112.001C265 117.001 254 115.001 250 115.001C263 123.001 272 133.001 266 143.001C261 152.001 249 152.001 243 143.001C238 136.001 238 126.001 238 122.001C233 137.001 228 150.001 218 149.001C208 148.001 204 138.001 210 130.001C215 123.001 224 118.001 229 116.001C215 119.001 201 115.001 200 105.001C198 95.001 207 88.001 216 91.001C223 92.001 228 98.001 232 102.001" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M235.999 103.002C240.999 100.002 246.999 105.002 245.999 111.002C244.999 117.002 237.999 119.002 233.999 114.002C229.999 110.002 230.999 105.002 235.999 103.002Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M174.001 182.001C165.001 174.001 161.001 161.001 168.001 155.001C175.001 148.001 185.001 152.001 189.001 159.001C192.001 166.001 187.001 176.001 185.001 182.001C195.001 174.001 206.001 172.001 212.001 179.001C218.001 186.001 214.001 196.001 207.001 198.001C201.001 201.001 192.001 199.001 189.001 199.001C201.001 207.001 205.001 216.001 199.001 223.001C192.001 230.001 183.001 226.001 180.001 219.001C177.001 213.001 178.001 205.001 178.001 204.001C174.001 215.001 170.001 226.001 161.001 225.001C152.001 224.001 149.001 215.001 154.001 208.001C158.001 202.001 165.001 200.001 169.001 197.001C158.001 200.001 147.001 195.001 148.001 186.001C149.001 177.001 157.001 174.001 164.001 177.001C169.001 179.001 171.001 183.001 174.001 186.001" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M177.002 187.003C182.002 184.003 188.002 189.003 186.002 194.003C185.002 200.003 178.002 201.003 175.002 197.003C172.002 194.003 173.002 189.003 177.002 187.003Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M267 216C259 210 260 200 264 193C267 186 274 180 280 181C286 182 287 190 284 197C281 205 276 213 267 216Z" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M263 205C266 206 270 209 271 213M267 216C275 216 280 211 281 207M269 200C272 195 275 190 279 187" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M163 282C151 270 132 272 120 259C109 247 109 233 105 224C119 229 136 228 147 240C158 252 156 268 163 282Z" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M114 236C128 247 142 257 152 269C157 275 161 279 165 286" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </>
    ),
  },
  lavender: {
    viewBox: "0 0 300 560",
    body: (
      <>
        <path d="M148 518C143 463 135 407 121 350C108 296 99 243 91 197C86 168 82 140 80 112" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M151 522C150 459 154 402 151 344C149 288 155 236 153 187C152 140 156 98 153 55" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M154 515C166 452 174 396 187 341C198 292 207 246 214 205C220 176 222 153 224 130" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M80 118C73 113 72 103 77 94C83 96 87 108 80 118Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M82 130C82 119 87 112 94 112C98 122 91 129 82 133M81 131C72 131 64 123 64 116C72 113 79 121 81 131Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M84 147.999C87 135.999 93 128.999 102 130.999C104 140.999 92 147.999 84 149.999M83 147.999C72 145.999 63 136.999 62 128.999C71 126.999 80 137.999 83 147.999Z" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M87 166C90 153 98 147 105 149C106 158 97 167 87 169M86 167C75 165 64 156 64 146C73 146 84 155 86 167Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M90 185.999C92 173.999 100 164.999 109 167.999C110 178.999 99 184.999 90 187.999M89 184.999C76 181.999 69 172.999 69 164.999C79 163.999 87 173.999 89 184.999Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M94.0018 204C97.0018 193 105.002 187 112.002 190C111.002 200 102.002 206 94.0018 207M93.0018 204C82.0018 202 73.0018 194 74.0018 184C84.0018 185 91.0018 193 93.0018 204Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M98.0013 224C101.001 216 107.001 212 113.001 214C112.001 221 105.001 225 98.0013 225M97.0013 222C87.0013 220 80.0013 214 81.0013 207C89.0013 208 95.0013 215 97.0013 222Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M152.997 67C146.997 61 147.997 48 152.997 40C158.997 45 161.997 58 152.997 67Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M154.999 82C156.999 71 161.999 64 168.999 65C171.999 75 162.999 82 154.999 85M153.999 82C144.999 78 138.999 69 141.999 61C149.999 62 153.999 73 153.999 82Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M154.999 101C156.999 89 164.999 82 172.999 84C173.999 94 163.999 101 154.999 103M153.999 101C142.999 96 134.999 87 136.999 78C145.999 78 152.999 91 153.999 101Z" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M154.999 121C157.999 109 167.999 101 175.999 105C174.999 115 164.999 122 154.999 124M153.999 121C142.999 117 132.999 108 133.999 98C144.999 98 152.999 110 153.999 121Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M153.997 143C157.997 129 166.997 123 174.997 126C174.997 136 164.997 143 153.997 145M153.997 142C140.997 137 131.997 128 133.997 117C144.997 119 151.997 130 153.997 142Z" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M153.998 163C157.998 151 167.998 143 176.998 147C174.998 157 164.998 163 153.998 166M152.998 162C140.998 159 129.998 149 131.998 139C142.998 140 150.998 151 152.998 162Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M153.998 185C158.998 172 168.998 167 175.998 171C173.998 180 163.998 185 153.998 187M152.998 183C140.998 179 132.998 171 133.998 161C142.998 162 150.998 173 152.998 183Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M153.997 205C159.997 195 165.997 191 171.997 194C170.997 202 162.997 207 153.997 208M152.997 204C142.997 201 135.997 193 136.997 186C145.997 187 150.997 195 152.997 204Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M154 224C158 218 164 215 168 217C167 223 160 225 154 225M153 222C145 220 141 215 141 210C148 211 152 216 153 222Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M223.998 139C218.998 131 221.998 119 228.998 114C232.998 122 231.998 133 223.998 139Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M224.001 154C229.001 143 236.001 139 242.001 142C241.001 151 232.001 156 224.001 157M223.001 154C215.001 151 209.001 141 212.001 133C220.001 135 224.001 145 223.001 154Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M221.002 174C228.002 162 236.002 159 245.002 163C242.002 172 231.002 176 221.002 177M221.002 173C210.002 168 205.002 158 208.002 150C218.002 153 222.002 164 221.002 173Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M218.001 194C224.001 183 234.001 178 241.001 183C238.001 192 227.001 196 218.001 197M217.001 194C207.001 188 201.001 178 204.001 169C214.001 172 218.001 183 217.001 194Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M215.001 214C222.001 203 232.001 200 239.001 205C235.001 214 225.001 217 215.001 218M214.001 214C202.001 207 197.001 197 201.001 188C211.001 193 215.001 204 214.001 214Z" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M211 235C218 225 228 222 234 227C230 235 220 238 211 238M211 234C201 229 195 219 197 212C207 215 211 225 211 234Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M207 255C214 248 222 247 226 251C222 257 214 258 207 257M207 253C200 249 196 242 197 236C204 239 207 246 207 253Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M144 483C119 463 99 429 84 392C74 369 65 350 55 337C80 352 99 387 113 418C127 447 138 467 144 483Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M140 476C115 442 95 396 73 365" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M148 498C133 462 128 424 130 387C131 364 130 345 126 326C140 351 143 382 142 410C141 446 146 479 148 498Z" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M145 481C135 436 138 390 133 365" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M158 490C178 455 192 421 205 385C217 354 228 334 243 319C232 343 226 370 218 395C204 438 183 470 158 490Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M164 481C192 444 212 392 225 356" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M152 513C170 492 189 475 207 459C220 447 231 434 238 422C233 448 214 466 194 481C176 494 161 505 152 513Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
        <path d="M147 507C124 497 106 482 92 463C80 447 70 437 60 431C82 435 101 451 114 468C127 484 137 497 147 507Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </>
    ),
  },
};

export function BotanicalOrnament({ name, className }: Props) {
  const { viewBox, body } = ORNAMENTS[name];
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      {body}
    </svg>
  );
}
