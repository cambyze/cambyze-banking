import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../Constants/colors';
import { useFocusEffect } from "@react-navigation/native";

export default function BankTransfer() {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation("bankTransfer");
    const [status, setStatus] = useState('personal');
    const [emitterId, setEmitterId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const navigation = useNavigation();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEmitterModalVisible, setEmitterModalVisible] = useState(false);
    const [isReceiverModalVisible, setReceiverModalVisible] = useState(false);

    const fetchAccounts = async () => {
        if (!user?.personId) return;
        console.log("fetchAccounts called for personId:", user.personId);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/findBanByPerson?personId=${user.personId}`);
            if (!response.ok) {
                console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched accounts:", data);
            const formattedAccounts = Array.isArray(data)
            ? data.map(account => ({
            id: account.bankAccountNumber || 'N/A',
            bankName: 'Cambyze Bank',
            accountNumber: account.bankAccountNumber || 'N/A',
            type: account.accountType === '1' ? t('BankTransfer.Banking') : t('BankTransfer.Saving'),
            balance: account.balanceAmount || 0,
            overdraft: account.overdraftAmount || 0,
              }))
            : [];
            setAccounts(formattedAccounts);
            setError(null);
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError(t('Set_Error_Loading_Account'));
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setAmount('');
            setEmitterId('');
            setReceiverId('');
            fetchAccounts();
        }, [user])
    );

    useEffect(() => {
        console.log("fetchAccounts called");
        fetchAccounts();
    }, [user]);

    const handleBankTransfer = async () => {
        try {
            const response = await fetch('http://localhost:8080/BankTransfer', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ amount, SendAccount: emitterId, ReceiveAccount: receiverId }).toString(),
            });
            console.log("Bank transfer response status:", response.status);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            alert(t('BankTransfer.Transfer_Success'));
            navigation.navigate('Account');
        } catch (error) {
            alert(t('BankTransfer.Transfer_Error'));
        }
    };

    const renderPersonalTransferForm = () => {
    return (
        <View style={styles.form}>
            {/* Compte Émetteur */}
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setEmitterModalVisible(true)}
            >
                <Text style={styles.selectButtonText}>
                    {emitterId
                        ? `${t('BankTransfer.Selected_Emitter')}: ${emitterId}`
                        : t('BankTransfer.Select_Emitter')}
                </Text>
            </TouchableOpacity>

            {/* Modal pour sélectionner le compte émetteur */}
            {isEmitterModalVisible && (
                <View style={styles.modal}>
                    <ScrollView>
                        {accounts.map((account) => (
                            <TouchableOpacity
                                key={account.id}
                                style={styles.modalItem}
                                onPress={() => {
                                    setEmitterId(account.accountNumber);
                                    setEmitterModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>
                                    {`${account.bankName} - ${account.accountNumber}`}
                                </Text>
                                <Text style={styles.modalItemSubText}>
                                    {`${t('BankTransfer.Balance')}: ${account.balance}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Compte Récepteur */}
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setReceiverModalVisible(true)}
            >
                <Text style={styles.selectButtonText}>
                    {receiverId
                        ? `${t('BankTransfer.Selected_Receiver')}: ${receiverId}`
                        : t('BankTransfer.Select_Receiver')}
                </Text>
            </TouchableOpacity>

            {/* Modal pour sélectionner le compte récepteur */}
            {isReceiverModalVisible && (
                <View style={styles.modal}>
                    <ScrollView>
                        {accounts.map((account) => (
                            <TouchableOpacity
                                key={account.id}
                                style={styles.modalItem}
                                onPress={() => {
                                    setReceiverId(account.accountNumber);
                                    setReceiverModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>
                                    {`${account.bankName} - ${account.accountNumber}`}
                                </Text>
                                <Text style={styles.modalItemSubText}>
                                    {`${t('BankTransfer.Balance')}: ${account.balance}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeModalButton}
                        onPress={() => setReceiverModalVisible(false)}
                    >
                        <Text style={styles.closeModalButtonText}>{t('BankTransfer.BankTransfer.Close')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput
                style={styles.input}
                placeholder={t('BankTransfer.Amount')}
                placeholderTextColor={colors.textInputPlaceholder}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <TouchableOpacity
                style={[styles.button, (!emitterId || !receiverId || !amount) && styles.buttonDisabled]}
                onPress={handleBankTransfer}
                disabled={!emitterId || !receiverId || !amount}
            >
                <Text style={styles.buttonText}>{t('BankTransfer.Perform_Transfer')}</Text>
            </TouchableOpacity>
        </View>
    );
};

    const renderExternalTransferForm = () => (
        <View style={styles.form}>
  <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setEmitterModalVisible(true)}
            >
                <Text style={styles.selectButtonText}>
                    {emitterId
                        ? `${t('BankTransfer.Selected_Emitter')}: ${emitterId}`
                        : t('BankTransfer.Select_Emitter')}
                </Text>
            </TouchableOpacity>

            {/* Modal pour sélectionner le compte émetteur */}
            {isEmitterModalVisible && (
                <View style={styles.modal}>
                    <ScrollView>
                        {accounts.map((account) => (
                            <TouchableOpacity
                                key={account.id}
                                style={styles.modalItem}
                                onPress={() => {
                                    setEmitterId(account.accountNumber);
                                    setEmitterModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>
                                    {`${account.bankName} - ${account.accountNumber}`}
                                </Text>
                                <Text style={styles.modalItemSubText}>
                                    {`${t('BankTransfer.Balance')}: ${account.balance}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
            <TextInput
                style={styles.input}
                placeholder={t('BankTransfer.Receiver_Account')}
                placeholderTextColor={colors.textInputPlaceholder}
                value={receiverId}
                onChangeText={setReceiverId}
            />
            <TextInput
                style={styles.input}
                placeholder={t('BankTransfer.Amount')}
                placeholderTextColor={colors.textInputPlaceholder}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TouchableOpacity
                style={[styles.button, (!emitterId || !receiverId || !amount) && styles.buttonDisabled]}
                onPress={handleBankTransfer}
                disabled={!emitterId || !receiverId || !amount}
            >
                <Text style={styles.buttonText}>{t('BankTransfer.Perform_Transfer')}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{t('BankTransfer.Title')}</Text>
            <Text style={styles.subHeader}>{t('BankTransfer.Subtitle')}</Text>

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    onPress={() => setStatus('personal')}
                    style={[
                        styles.toggle,
                        status === 'personal' && styles.toggleSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            status === 'personal' && styles.toggleTextSelected,
                        ]}
                    >
                        {t('BankTransfer.Personal_Transfer')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setStatus('BankTransfer.external')}
                    style={[
                        styles.toggle,
                        status === 'external' && styles.toggleSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            status === 'external' && styles.toggleTextSelected,
                        ]}
                    >
                        {t('BankTransfer.External_Transfer')}
                    </Text>
                </TouchableOpacity>
            </View>

            {status === 'personal' ? renderPersonalTransferForm() : renderExternalTransferForm()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: colors.background,
    },
    header: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.primary,
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    toggle: {
        flex: 1,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        borderColor: colors.border,
    },
    toggleSelected: {
        backgroundColor: colors.toogleBackground,
        borderColor: colors.toogleBorder,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.toggleText,
    },
    toggleTextSelected: {
        color: colors.toggleTextOff,
    },
    form: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.textInputBorder,
        borderRadius: 8,
        fontSize: 16,
        color: colors.textPrimary,
    },
    button: {
        width: '100%',
        backgroundColor: colors.buttonBackGround,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: colors.ButtonDisabled,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: '600',
    },
    selectButton: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.textInputBorder,
    borderRadius: 8,
    backgroundColor: colors.buttonBackGround,
    },
    selectButtonText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.modalOverlay, // Fond complètement opaque
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Assure que la modal est au-dessus de tout
},
modal: {
    width: '80%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
},
    modalItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.textInputBorder,
    },
    modalItemText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    modalItemSubText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    closeModalButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: colors.buttonBackGround,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: '600',
    },
});