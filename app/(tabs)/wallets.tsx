import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

interface Account {
  accountId: string;
  referenceName: string;
  accountNumber: string;
  accountName: string;
  productName: string;
  kycCompliant: boolean;
}

const demoAccounts: Account[] = [
  {
    accountId: "123456789",
    referenceName: "Main Savings",
    accountNumber: "000123456789",
    accountName: "John Doe",
    productName: "Savings Account",
    kycCompliant: true,
  },
  {
    accountId: "987654321",
    referenceName: "Business Account",
    accountNumber: "000987654321",
    accountName: "John Doe Enterprises",
    productName: "Business Current Account",
    kycCompliant: false,
  },
];

const AccountInfo: React.FC = () => {
  const fetchBalance = (accountId: string) => {
    console.log(`Fetching balance for ${accountId}`);
    // You may replace this with navigation or API call
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Information</Text>

      {demoAccounts.length > 0 ? (
        <View style={styles.grid}>
          {demoAccounts.map((account) => (
            <View key={account.accountId} style={styles.card}>
              <Text style={styles.referenceName}>{account.referenceName}</Text>
              <Text style={styles.accountId}>{account.accountId}</Text>

              <View style={styles.details}>
                <Text style={styles.label}>Account Number:</Text>
                <Text style={styles.value}>{account.accountNumber}</Text>

                <Text style={styles.label}>Account Holder:</Text>
                <Text style={styles.value}>{account.accountName}</Text>

                <Text style={styles.label}>Product Name:</Text>
                <Text style={styles.value}>{account.productName}</Text>

                <Text style={styles.label}>KYC Compliant:</Text>
                <Text style={styles.value}>{account.kycCompliant ? "Yes" : "No"}</Text>
              </View>

              <TouchableOpacity
                onPress={() => fetchBalance(account.accountId)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Fetch Balance</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.alert}>
          <Text style={styles.alertText}>No account information found.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  grid: {
    flexDirection: "column",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  referenceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  accountId: {
    color: "#555",
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    color: "#666",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  alert: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  alertText: {
    color: "#555",
  },
});

export default AccountInfo;
