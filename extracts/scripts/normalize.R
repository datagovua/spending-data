transactions <- read.csv('transactions.csv')

without_bank_names <- transactions[,!names(transactions) %in% c("payer_mfo_nm","recipt_mfo_nm")]
write.csv(without_bank_names, file="extracts/transactions.csv", row.names=FALSE)

transactions <- without_bank_names

without_edrpou <- transactions[,!names(transactions) %in% c("payer_nm","recipt_nm")]
write.csv(without_edrpou, file="extracts/transactions.csv", row.names=FALSE)

