# The raw passphrase to clean:
raw_phrase = "aP!pL3e#S4aU%cE"



# YOUR GOAL: Clean up this phrase using the 3 Security Rules below!

print (raw_phrase.translate(str.maketrans('', '', '!#%1234567890')).upper())
