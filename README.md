# What is this?
This is my first addon I ever made. It is only for Firefox and it is supposed to extend the opening name in [chess.com](chess.com). If you played moves like 1.e4 e5, the opening name will be "King's Pawn Opening: 1...e5" instead of the boring "King's Pawn Opening" Also you can make the opening name scroll instead of being clipped with ellipses.
# How do you make it work?
There is a link next to the opening name that has some useful data. See [https://www.chess.com/openings/Kings-Pawn-Opening-1...e5](https://www.chess.com/openings/Kings-Pawn-Opening-1...e5). Look at the "1...e5" part. I extract that part and put it in a `<span>` element. Then, I add the `<span>` element to the opening name and do a few adjustments like adding a colon before the number thing and formatting it with regular expressions. I used [https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension) to help me.   
Extension disabled   
![Opening name without number thing to the right](https://github.com/hueychen27/chess.com-opening-name-improver/blob/main/chess_opening_1.png?raw=true)
Extension enabled   
![Opening name with number thing to the right](https://github.com/hueychen27/chess.com-opening-name-improver/blob/main/chess_opening_2.png?raw=true)