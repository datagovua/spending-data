transactions <- read.csv('transactions.csv')

payer_mfos <- transactions[,c("payer_mfo_knw_id", "payer_mfo_nm")]
names(payer_mfos) <- c("mfo","name")
# mfo can be missing, TODO: fix this
payer_mfos <- unique(payer_mfos[complete.cases(payer_mfos),])

recipt_mfos <- transactions[, c("recipt_mfo_knw_id", "recipt_mfo_nm")]
names(recipt_mfos) <- c("mfo","name")
# mfo can be missing, TODO: fix this
recipt_mfos <- unique(recipt_mfos[complete.cases(recipt_mfos),])

mfos <- unique(rbind(payer_mfos, recipt_mfos))

write.csv(mfos, file="mfos.csv", row.names=FALSE)

