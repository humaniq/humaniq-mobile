import { Card, Colors, Text, View } from "react-native-ui-lib";
import { Header } from "../../../components/header/Header";
import { t } from "../../../i18n";
import React from "react";
import { Screen } from "../../../components";
import { useNavigation } from "@react-navigation/native";
import HumaniqLogo from "../../../assets/images/logo-brand-full.svg"
import { MenuItem } from "../../../components/menuItem/MenuItem";
import Hyperlink from 'react-native-hyperlink'

const pack = require("../../../package.json")

export const AboutPage = () => {
    const nav = useNavigation()
    return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <Header title={ t("settingsScreen.menu.aboutApplication") }/>
        <View testID={ 'aboutPage' } flex paddingT-20 paddingH-16>
            <View row center>
                <HumaniqLogo width={ 122 } height={ 50 }/>
            </View>
            <View row center>
                <Text text12 textGrey>
                    v { pack.version }
                </Text>
            </View>
            <View paddingT-24>
                <Card>
                    <MenuItem testID={'privacyPolicyPage'} name={ t("settingsScreen.menu.privacyPolicyName") }
                              onPress={ () => nav.navigate("privacyPolicyPage") }/>
                    <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 20 } }/>
                    <MenuItem testID={'termsOfServicePage'} name={ t("settingsScreen.menu.termsOfServiceName") }
                              onPress={ () => nav.navigate("termsOfServicePage") }/>
                </Card>
            </View>
        </View>
    </Screen>
}

export const PrivacyPolicyPage = () => {
    return <Screen preset={ "scroll" } backgroundColor={ Colors.white }
                   statusBarBg={ Colors.white }>
        <Header title={ t("settingsScreen.menu.privacyPolicyName") }/>
        <View testID={ 'privacyPolicyPage' } flex paddingT-20 paddingH-16>
            <Text robotoM>
                Last updated: 14 December 2021
            </Text>
            <Text marginT-10>
                Humaniq is committed to protecting your privacy and collecting only the minimum amount of info needed to
                provide
                our software and services (including the Humaniq mobile application and website) — referred to as
                “Services”.
                Your use of the Services indicates you agree to this policy and our terms of use.
            </Text>
            <Text marginT-20 text16 robotoM>
                Summary
            </Text>
            <Text marginT-10>
                Nothing in this policy contradicts the following statements:
            </Text>
            <Text marginT-10>
                - We don’t collect any of your personal info, including your IP address, other than information you
                voluntarily
                provide.
            </Text>
            <Text marginT-10>
                - We don’t sell your personal info to advertisers or other third parties.
            </Text>
            <Text marginT-10>
                - We share your personal info only when legally required, or when reasonably necessary to prevent harm
                in an
                emergency situation.
            </Text>
            <Text marginT-10>
                - We retain your personal info, excluding info you make public, for no more than 30 days after you
                request
                deletion.
            </Text>
            <Text marginT-10>
                - We have never received any legal or government demands for user information.
            </Text>
            <Text marginT-20 text16 robotoM>
                Complete terms
            </Text>
            <Text marginT-10>
                As used in this policy, “Personal Info” is data that can identify a particular person or device.
                Aggregate data
                isn’t considered Personal Info.
            </Text>
            <Text marginT-10>
                1. Humaniq never collects your Personal Info except to communicate with you
                Our Services don't collect any of your Personal Info. Unlike most websites, our site doesn’t collect
                your IP
                address. We do detect non-personally identifiable geo-location information to optimize our services, but
                we
                definitely don't collect your precise geo-location or associate geo-location information with a
                particular user.
            </Text>
            <Text marginT-10>
                Because we do not collect information about your online activities over time and across third-party
                websites or
                online services, there is no need for us to respond to a browser’s Do Not Track settings, although we
                strongly
                support a consumer’s right to set such a preference and encourage all website operators to honor this
                consumer
                choice.
            </Text>
            <Text marginT-10>
                We may request your email address or a username to communicate with you. This info is used only as you’d
                expect
                and deleted upon request.
            </Text>
            <Text marginT-10>
                Optionally, you may choose to provide your email address and communicate with us via email.
            </Text>
            <Text marginT-10>
                To improve the Services and your experience on our site, we may collect aggregate usage data from the
                Services
                and our website, including number of page views, visitor browser types, operating systems, or the links
                clicked
                to navigate to and from our site. We use a non-identifying first-party browser cookie to remember your
                preferences (language, country) for our search service at https://humaniq.com and it's subdomains. Our
                cookies
                don’t track you. Most browsers allow you to refuse cookies or disable them, you can find out more here.
                Or check
                your browser preferences.
            </Text>
            <Text marginT-10>
                2. Humaniq never sells your email address or any other Personal Info you volunteer
                We don’t receive payment in cash or in kind from third parties in exchange for your Personal Info.
                Further, we
                don’t allow third parties to collect info about you on our site through cookies or other means.
            </Text>
            <Text marginT-10>
                3. Humaniq shares your Personal Info only in specific circumstances
                There are a few, rare circumstances when we may have to share your Personal Info either to obey the law
                or
                protect our rights. We’ll share your Personal Info only to comply with laws or legally enforceable
                requests, to
                enforce our own rights and contracts with users or third parties, or to prevent harm to others and their
                property in an emergency situation.
            </Text>
            <Text marginT-10>
                In all instances, we’ll share the minimum info necessary to meet the immediate need and inform you of
                our
                disclosure when legally and practically possible.
            </Text>
            <Text marginT-10>
                4. Humaniq retains the Personal Info you volunteer for one month or less
                We remove your Personal Info from our records within 30 days of any request to do so.
            </Text>
            <Text marginT-10>
                5. Transparency report
                As explained above, we will comply with a request for user data when the law requires it, but we require
                valid
                legal process to compel the disclosure of user data to the government; such as a legitimate and properly
                scoped
                court order, or a search warrant supported by probable cause and issued by an appropriate law
                enforcement
                authority. We interpret requests narrowly, and we will oppose unlawful or overbroad requests for
                specific user
                data.
            </Text>
            <Text marginT-10>
                Recipients of National Security Requests can only publish reporting bands instead of specific figures.
                If we
                receive such a request, we may challenge these reporting bands, in addition to opposing any unlawful or
                overbroad requests.
            </Text>
            <Hyperlink linkStyle={ { color: Colors.primary } }>
                <Text marginT-10>
                    Changes to this policy
                    We may make small, inconsequential changes to this policy with or without notice to you, so you’re
                    encouraged
                    to
                    review the policy from time to time. Substantive changes to this policy will be emailed to users who
                    submit a
                    request to privacy@humaniq.com.
                </Text>
            </Hyperlink>
            <Text marginT-20 text16 robotoM>
                Contact
            </Text>
            <Hyperlink linkStyle={ { color: Colors.primary } }>
                <Text marginV-10>
                    You can contact us at privacy@humaniq.com if you have any questions about this policy.
                </Text>
            </Hyperlink>
        </View>
    </Screen>
}

export const TermsOfServicePage = () => {
    return <Screen preset={ "scroll" } backgroundColor={ Colors.white }
                   statusBarBg={ Colors.white }>
        <Header title={ t("settingsScreen.menu.termsOfServiceName") }/>
        <View testID={ 'termsOfServicePage' } flex paddingT-20 paddingH-16>
            <Text robotoM>
                Last updated: 12 December 2021
            </Text>
            <Text marginT-10>
                These Terms of Use (the “Terms”) govern the basic rights and obligations that you and us have when you
                use
                Humaniq website, download, browse, access or in other way use Humaniq mobile application (the
                “Services”) and
                constitute a binding agreement between HMQ and yourself. The Terms also mean our Privacy Policy, Data
                Privacy
                Policy and other policies on our policies page, which are incorporated herein. You can opt not to enjoy
                the
                Services, if you don’t want the Terms to apply.
            </Text>
            <Text marginT-20 text16 robotoM>
                1. Legal Capacity
            </Text>
            <Text marginT-10>
                1.1. You confirm that you have the legal capacity in your country to enter a binding agreement. In case
                if you
                are a minor you should be emancipated or granted consent from your legal representatives (parents or
                guardians).
                You further represent and warrant that you will not use the Humaniq website or Humaniq mobile
                application if the
                laws of your country prohibit you from doing so in accordance with these Terms.
            </Text>
            <Text marginT-10>
                1.2. The Services are not intended for children under 13 and if you are under 13, please stop using the
                Services.
            </Text>
            <Text marginT-20 text16 robotoM>
                2. Use of the Humaniq mobile application
            </Text>
            <Text marginT-10>
                2.1. We will use reasonable endeavours to correct any errors or omissions as soon as practicable after
                being
                notified of them. However, we do not guarantee that the Services or the Humaniq mobile application will
                be free
                of faults, and we do not accept liability for any such faults, errors or omissions. In the event of any
                such
                error, fault or omission, please report it to us.
            </Text>
            <Text marginT-10>
                2.2. We do not warrant that your use of the Services or the Humaniq mobile application will be
                uninterrupted and
                we do not warrant that any information (or messages) transmitted via the Services or the Humaniq mobile
                application will be transmitted accurately, reliably, in a timely manner or at all. Notwithstanding that
                we will
                try to allow uninterrupted access to the Services and the Humaniq mobile application, access to the
                Services and
                the Humaniq mobile application may be suspended, restricted or terminated at any time.
            </Text>
            <Text marginT-10>
                2.3. We do not give any warranty that the Services and the Humaniq mobile application are free from
                viruses or
                anything else which may have a harmful effect on any technology.
            </Text>
            <Text marginT-10>
                2.4. We reserve the right to change, modify, substitute, suspend or remove without notice any
                information or
                Services on the Humaniq mobile application from time to time. So the Services are provided on an "as is"
                principle, i.e. the type and extent of their provision by Humaniq when you access the Services.
            </Text>
            <Text marginT-10>
                Your access to the Humaniq mobile application and/or the Services may also be occasionally restricted to
                allow
                for repairs, maintenance or the introduction of new facilities or services. We will attempt to restore
                such
                access as soon as we reasonably can.
            </Text>
            <Text marginT-10>
                2.7. The provision of the Services and the Humaniq mobile application does not include the provision of
                a mobile
                telephone or handheld device or other necessary equipment to access the Humaniq mobile application. To
                use the
                Humaniq mobile application you will require Internet connectivity and appropriate telecommunication
                links. You
                acknowledge that the terms of agreement with your respective mobile network provider will continue to
                apply when
                using the Humaniq mobile application.
            </Text>
            <Text marginT-10>
                2.8. When using the features of distributed applications through application browser or performing
                wallet
                transactions with any tokens, you are acting on your own behalf and understanding the risk of making
                transactions on blockchain with other users or smart-contracts. Humaniq provides only information
                support and
                will not be the organizer, party, agent or other representative to the users within those transactions
                between
                the users or smart-contracts. It is your responsibility to ensure that the conditions of such
                transactions
                available through the Humaniq mobile application meet your specific requirements before making any
                transaction.
            </Text>
            <Text marginT-10>
                2.9. Humaniq does not collect, store or use any personal information. Humaniq does not take
                responsibility for
                the personal information inquiries from third-party services or applications discovered through Humaniq
                application browser.
            </Text>
            <Text marginT-20 text16 robotoM>
                3. Security
            </Text>
            <Text marginT-10>
                3.1. You will monitor the security of your wallet recovery phrase and private keys access details and
                not
                disclose them to third parties. Any action taken from your user account in Humaniq mobile application
                shall be
                deemed to be an act of your own, authorized by you and establishing the duties and liability for you in
                respect
                of such actions.
            </Text>
            <Text marginT-10>
                3.3. Humaniq has the right to use available technical solutions to verify the correctness of the
                information
                provided by you.
            </Text>
            <Text marginT-10>
                3.4. Humaniq or the third-party applications have the ability to ask you to sign the data with your
                private key
                to cryptographically prove that data provided is on the behalf of the appropriate wallet address.
                However,
                Humaniq does not store, transfer or possess the information about the wallet recovery phrase or private
                key.
            </Text>
            <Text marginT-20 text16 robotoM>
                4. Intellectual property rights
            </Text>
            <Text marginT-10>
                4.1. All editorial content, information, photographs, illustrations, artwork and other graphic
                materials, and
                names, logos and trade marks on the Humaniq mobile application and the Humaniq website are protected by
                copyright laws and/or other laws and/or international treaties, and belong to us and/or our suppliers,
                as the
                case may be. These works, logos, graphics, sounds or images may not be copied, reproduced,
                retransmitted,
                distributed, disseminated, sold, published, broadcasted or circulated whether in whole or in part,
                unless
                expressly permitted by us and/or our suppliers, as the case may be.
            </Text>
            <Text marginT-10>
                4.2. By using the Services, you do not acquire any ownership rights in materials contained therein.
                Misuse of
                any trademarks or any other content displayed on the Humaniq mobile application or the Humaniq website
                is
                prohibited.
            </Text>
            <Text marginT-20 text16 robotoM>
                5. Indemnity
            </Text>
            <Text marginT-10>
                You agree to indemnify and hold harmless Humaniq from and against any and all claims, demands,
                liabilities,
                costs or expenses, including reasonable attorney’s fees, resulting from your breach of the Terms.
            </Text>
            <Text marginT-20 text16 robotoM>
                6. Release
            </Text>
            <Text marginT-10>
                If you have a dispute with one or more users, you release Humaniq from all claims, demands, liabilities,
                costs,
                or expenses and damages. In entering into this release, you expressly waive any protections (whether
                statutory
                or otherwise) to the extent permitted by applicable law that would otherwise limit the coverage of this
                release
                to include only those claims which you may know or suspect to exist in your favor at the time of
                agreeing to
                this release.
            </Text>
            <Text marginT-20 text16 robotoM>
                7. Local Regulations.
            </Text>
            <Text marginT-10>
                7.1. We make no representation that the Service is permitted by law in any particular location. To the
                extent
                you choose to access the Service, you do so at your own initiative and are responsible for compliance
                with any
                applicable laws, including but not limited to applicable local laws.
            </Text>
            <Text marginT-10>
                7.2. You specifically agree to comply with all applicable laws concerning the transmission of technical
                data
                exported from the United States or the country you reside in.
            </Text>
            <Text marginT-20 text16 robotoM>
                8. Limitation of liability
            </Text>
            <Text marginT-10>
                8.1. We shall not be liable in contract, tort (including negligence or breach of statutory duty) or
                otherwise
                howsoever and whatever the cause thereof, for any indirect, consequential, collateral, special or
                incidental
                loss or damage suffered or incurred by you in connection with the Humaniq mobile application and the
                Terms. For
                the purposes of the Terms, indirect or consequential loss or damage includes, without limitation, loss
                of
                revenue, profits, anticipated savings or business, loss of data or goodwill, loss of use or value of any
                equipment including software, claims of third parties, and all associated and incidental costs and
                expenses.
            </Text>
            <Text marginT-10>
                8.2. We shall not be liable for any acts or omissions of any third parties howsoever caused, and for any
                direct,
                indirect, incidental, special, consequential or punitive damages, howsoever caused, resulting from or in
                connection with the mobile application and the services offered in the mobile application, your access
                to, use
                of or inability to use the mobile application or the services offered in the mobile application,
                reliance on or
                downloading from the mobile application and/or services, or any delays, inaccuracies in the information
                or in
                its transmission including but not limited to damages for loss of business or profits, use, data or
                other
                intangible, even if we have been advised of the possibility of such damages.
            </Text>
            <Text marginT-10>
                8.3. The above exclusions and limitations apply only to the extent permitted by law. None of your
                statutory
                rights as a consumer that cannot be excluded or limited are affected.
            </Text>
            <Text marginT-10>
                8.4. Notwithstanding our efforts to ensure that our system is secure, you acknowledge that all
                electronic data
                transfers are potentially susceptible to interception by others. We do not warrant that data transfers
                via the
                Humaniq mobile application will not be intercepted or read by third parties.
            </Text>
            <Text marginT-20 text16 robotoM>
                9. Suspension and termination
            </Text>
            <Text marginT-10>
                9.1. If you or anyone other than you, with your permission use(s) the Humaniq mobile application, any
                Services
                in contravention of the Terms, we may suspend your use of the Services and/or Humaniq mobile
                application.
            </Text>
            <Text marginT-10>
                9.2. If we suspend the Services or Humaniq mobile application, we may refuse to restore the Services or
                Humaniq
                mobile application for your use until we receive an assurance from you, in a form we deem acceptable,
                that there
                will be no further breach of the provisions of the Terms.
            </Text>
            <Text marginT-10>
                9.3. Without limitation to anything else in this Clause 9, we shall be entitled immediately or at any
                time (in
                whole or in part) to suspend the Services and/or Humaniq mobile application if we suspect, on reasonable
                grounds, that you may have committed or be committing any fraud against us or any other person.
            </Text>
            <Text marginT-10>
                9.4. Our rights under this Clause 9 shall not prejudice any other right or remedy we may have in respect
                of any
                breach or any rights, obligations or liabilities accrued prior to termination.
            </Text>
            <Text marginT-20 text16 robotoM>
                10. Applicable law and jurisdiction
            </Text>
            <Text marginT-10>
                10.1. The Services may be accessed from all countries around the world where the local technology
                permits. As
                each of these places have differing laws, by accessing the Services both you and we agree that the laws
                of
                England and Wales, without regard to the conflicts of laws principles thereof, will govern the Terms and
                apply
                to all matters relating to the use of the Services.
            </Text>
            <Text marginT-10>
                10.2. You accept and agree that both you and we shall submit to the exclusive jurisdiction of the courts
                of
                England and Wales in respect of any dispute arising out of and/or in connection with the Terms and use
                of
                Services.
            </Text>
            <Text marginT-10>
                10.3. If you ever wish to seek any relief from us, you waive the ability to pursue class action.
            </Text>
            <Text marginT-20 text16 robotoM>
                11. Severability
            </Text>
            <Text marginT-10>
                11.1. If any provision of these Terms is deemed unlawful, void or for any reason unenforceable, then
                that
                provision shall be deemed severable from these Terms and will not affect the validity and enforceability
                of any
                remaining provisions.
            </Text>
            <Text marginT-20 text16 robotoM>
                12. Updates to Terms
            </Text>
            <Text marginT-10>
                12.1. We reserve the right to amend the Terms from time to time without notice. The revised Terms will
                be posted
                on the Humaniq website and shall take effect from the date of such posting. You are advised to review
                these
                terms and conditions periodically as they are binding upon you.
            </Text>
            <Text marginV-10>
                12.2. If you do not agree to updated Terms, you should stop using our Services and/or close your
                account. Your
                continued use of any of our Services will be deemed as your acceptance of any revisions.
            </Text>
        </View>
    </Screen>
}