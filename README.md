# Hindi-Practice
A web application to help practice the Hindi script by transliterating between Devanagārī and Latin scripts.

A live version can be found at https://toransharma.com/hindi

The application has two parts: the main question area, and an HTML5 canvas area that user can use to draw on.

## Transliteration Direction
There are two directions of transliteration that can be chosen from the starting screen:  
Latin to Hindi
Hindi to Latin

In both of these, Latin refers to the [ISO 15919](https://en.wikipedia.org/wiki/ISO_15919) standard for the transliteration of Devanagari 
characters to Latin characters.

Each question presents the user with either a vowel, or a consonant-vowel combination. The ordering of the questions, 
and the vowel that is combined with the consonant is randomised.

## Characters Tested
In both directions, the set of characters that is tested are:  
The 11 vowels (a, ā, i, ī, u, ū, r̥, ē, ai, ō, au) in both their independant and diacritic forms, 
the 38 consonants including 7 nuqta consonants found in Hindi.
Note that this currently does not include ṅ (ङ) and ñ (ञ) as they are not found on their own in Hindi.

## Writing Area
The writing area can be used to write the answer to each question before clicking the show answer button.
It can be used either clicking and dragging with a mouse or by drawing on a touchscreen device.
It is not checked in any way against the answer, and is simply there to be used as a substitute for pen and paper.

The writing area is cleared when the next question is shown and can be cleared manually by the user by either right clicking with a mouse,
or double tapping on a touchscreen device.
