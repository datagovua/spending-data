transactions <- read.csv('transactions.csv')

payers <- transactions[,c("payer_edrpou", "payer_nm")]
names(payers) <- c("edrpou","name")
# mfo can be missing, TODO: fix this
payers <- unique(payers[complete.cases(payers),])

recipts <- transactions[, c("recipt_edrpou", "recipt_nm")]
names(recipts) <- c("edrpou","name")
# mfo can be missing, TODO: fix this
recipts <- unique(recipts[complete.cases(recipts),])

orgs <- unique(rbind(payers, recipts))

orgs <- orgs[order(orgs$edrpou),]

write.csv(orgs, file="extracts/edrpou.csv", row.names=FALSE)

