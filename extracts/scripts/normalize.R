without_bank_names <- transactions[,!names(transactions) %in% c("payer_mfo_nm","recipt_mfo_nm")]
write.csv(without_bank_names, file="extracts/transactions.csv", row.names=FALSE)

