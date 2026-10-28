import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { 
  User, 
  SchoolIdentity, 
  GuestVisit, 
  OfficialLetter, 
  IncomingLetter, 
  HumasAgenda, 
  PublicServiceTicket, 
  CitizenComplaint, 
  SchoolPartner, 
  HumasPublication, 
  SystemNotification 
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';

// All Views
import { DashboardView } from './views/DashboardView';
import { PublicGuestBookView } from './views/PublicGuestBookView';
import { GuestManagementView } from './views/GuestManagementView';
import { LetterGeneratorView } from './views/LetterGeneratorView';
import { OutgoingLettersView } from './views/OutgoingLettersView';
import { LetterApprovalView } from './views/LetterApprovalView';
import { IncomingLetterView } from './views/IncomingLetterView';
import { LetterVerificationView } from './views/LetterVerificationView';
import { PublicServiceView } from './views/PublicServiceView';
import { ComplaintView } from './views/ComplaintView';
import { PartnersView } from './views/PartnersView';
import { PublicationView } from './views/PublicationView';
import { HumasAgendaView } from './views/HumasAgendaView';
import { AiAssistantView } from './views/AiAssistantView';
import { SchoolProfileView } from './views/SchoolProfileView';
import { UserManagementView } from './views/UserManagementView';

import Swal from 'sweetalert2';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [schoolIdentity, setSchoolIdentity] = useState<SchoolIdentity>(() => StorageService.getSchoolIdentity());
  const [allUsers, setAllUsers] = useState<User[]>(() => StorageService.getUsers());
  const [guestVisits, setGuestVisits] = useState<GuestVisit[]>(() => StorageService.getGuestVisits());
  const [officialLetters, setOfficialLetters] = useState<OfficialLetter[]>(() => StorageService.getOfficialLetters());
  const [incomingLetters, setIncomingLetters] = useState<IncomingLetter[]>(() => StorageService.getIncomingLetters());
  const [agendas, setAgendas] = useState<HumasAgenda[]>(() => StorageService.getAgendas());
  const [publicServices, setPublicServices] = useState<PublicServiceTicket[]>(() => StorageService.getPublicServices());
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => StorageService.getComplaints());
  const [partners, setPartners] = useState<SchoolPartner[]>(() => StorageService.getPartners());
  const [publications, setPublications] = useState<HumasPublication[]>(() => StorageService.getPublications());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => StorageService.getNotifications());

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [letterToEdit, setLetterToEdit] = useState<OfficialLetter | null>(null);

  // Sync state whenever storage emits change
  useEffect(() => {
    const handleStorageChange = () => {
      setSchoolIdentity(StorageService.getSchoolIdentity());
      setAllUsers(StorageService.getUsers());
      setGuestVisits(StorageService.getGuestVisits());
      setOfficialLetters(StorageService.getOfficialLetters());
      setIncomingLetters(StorageService.getIncomingLetters());
      setAgendas(StorageService.getAgendas());
      setPublicServices(StorageService.getPublicServices());
      setComplaints(StorageService.getComplaints());
      setPartners(StorageService.getPartners());
      setPublications(StorageService.getPublications());
      setNotifications(StorageService.getNotifications());
    };

    window.addEventListener('simhumas_data_updated', handleStorageChange);
    return () => window.removeEventListener('simhumas_data_updated', handleStorageChange);
  }, []);

  // Handlers for Auth
  const handleLogin = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'tamu') {
      setCurrentView('buku_tamu_publik');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSwitchUser = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'tamu') {
      setCurrentView('buku_tamu_publik');
    }
  };

  // Handlers for Guest Book
  const handleRegisterVisit = (visit: GuestVisit) => {
    StorageService.saveGuestVisit(visit);
    setGuestVisits(StorageService.getGuestVisits());
  };

  const handleCheckOutGuest = (guestId: string) => {
    const visits = StorageService.getGuestVisits();
    const guest = visits.find(v => v.id === guestId);
    if (guest) {
      const now = new Date();
      const checkOutTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Calculate duration
      let durationMinutes = 30; // sensible default
      if (guest.checkInTime) {
        const [inH, inM] = guest.checkInTime.split(':').map(Number);
        const [outH, outM] = checkOutTime.split(':').map(Number);
        const diffM = (outH * 60 + outM) - (inH * 60 + inM);
        durationMinutes = diffM > 0 ? diffM : 30;
      }

      const updated: GuestVisit = {
        ...guest,
        checkOutTime,
        durationMinutes,
        status: 'selesai'
      };
      StorageService.saveGuestVisit(updated);
      setGuestVisits(StorageService.getGuestVisits());
    }
  };

  const handleDeleteGuest = (id: string) => {
    StorageService.deleteGuestVisit(id);
    setGuestVisits(StorageService.getGuestVisits());
  };

  // Handlers for Official Letters
  const handleSaveLetter = (letter: OfficialLetter) => {
    StorageService.saveOfficialLetter(letter);
    setOfficialLetters(StorageService.getOfficialLetters());
    setLetterToEdit(null);
  };

  const handleSubmitForApproval = (letter: OfficialLetter) => {
    StorageService.saveOfficialLetter(letter);
    setOfficialLetters(StorageService.getOfficialLetters());
    setLetterToEdit(null);
    setCurrentView('surat_keluar');
  };

  const handleApproveLetter = (letterId: string, notes?: string) => {
    const ltr = officialLetters.find(l => l.id === letterId);
    if (ltr) {
      const updated: OfficialLetter = {
        ...ltr,
        status: 'disetujui',
        approvalNotes: notes || 'Disetujui oleh Kepala Sekolah',
        approvedAt: new Date().toISOString()
      };
      StorageService.saveOfficialLetter(updated);
      setOfficialLetters(StorageService.getOfficialLetters());
    }
  };

  const handleRejectLetter = (letterId: string, reason: string) => {
    const ltr = officialLetters.find(l => l.id === letterId);
    if (ltr) {
      const updated: OfficialLetter = {
        ...ltr,
        status: 'ditolak',
        approvalNotes: `Ditolak: ${reason}`
      };
      StorageService.saveOfficialLetter(updated);
      setOfficialLetters(StorageService.getOfficialLetters());
    }
  };

  const handleRequestRevision = (letterId: string, notes: string) => {
    const ltr = officialLetters.find(l => l.id === letterId);
    if (ltr) {
      const updated: OfficialLetter = {
        ...ltr,
        status: 'revisi',
        approvalNotes: `Catatan Revisi: ${notes}`
      };
      StorageService.saveOfficialLetter(updated);
      setOfficialLetters(StorageService.getOfficialLetters());
    }
  };

  const handleDeleteLetter = (id: string) => {
    StorageService.deleteOfficialLetter(id);
    setOfficialLetters(StorageService.getOfficialLetters());
  };

  const handleEditLetter = (letter: OfficialLetter) => {
    setLetterToEdit(letter);
    setCurrentView('buat_surat');
  };

  // Handlers for Incoming Letters
  const handleSaveIncomingLetter = (letter: IncomingLetter) => {
    StorageService.saveIncomingLetter(letter);
    setIncomingLetters(StorageService.getIncomingLetters());
  };

  const handleDeleteIncomingLetter = (id: string) => {
    StorageService.deleteIncomingLetter(id);
    setIncomingLetters(StorageService.getIncomingLetters());
  };

  // Handlers for other modules
  const handleSavePublicService = (t: PublicServiceTicket) => {
    StorageService.savePublicService(t);
    setPublicServices(StorageService.getPublicServices());
  };

  const handleSaveComplaint = (c: CitizenComplaint) => {
    StorageService.saveComplaint(c);
    setComplaints(StorageService.getComplaints());
  };

  const handleSavePartner = (p: SchoolPartner) => {
    StorageService.savePartner(p);
    setPartners(StorageService.getPartners());
  };

  const handleDeletePartner = (id: string) => {
    StorageService.deletePartner(id);
    setPartners(StorageService.getPartners());
  };

  const handleSavePublication = (pub: HumasPublication) => {
    StorageService.savePublication(pub);
    setPublications(StorageService.getPublications());
  };

  const handleDeletePublication = (id: string) => {
    StorageService.deletePublication(id);
    setPublications(StorageService.getPublications());
  };

  const handleSaveAgenda = (agd: HumasAgenda) => {
    StorageService.saveAgenda(agd);
    setAgendas(StorageService.getAgendas());
  };

  const handleDeleteAgenda = (id: string) => {
    StorageService.deleteAgenda(id);
    setAgendas(StorageService.getAgendas());
  };

  const handleSaveSchoolIdentity = (id: SchoolIdentity) => {
    StorageService.setSchoolIdentity(id);
    setSchoolIdentity(id);
  };

  const handleSaveUser = (u: User) => {
    StorageService.saveUser(u);
    setAllUsers(StorageService.getUsers());
  };

  const handleResetDatabase = () => {
    Swal.fire({
      title: 'Reset Pangkalan Data Sekolah?',
      text: 'Semua data buku tamu, surat keluar, disposisi, dan perubahan konfigurasi akan dikembalikan ke data awal resmi SD Islam Imama.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Reset Data Demo',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed) {
        StorageService.resetAll();
        setCurrentUser(StorageService.getCurrentUser());
        setSchoolIdentity(StorageService.getSchoolIdentity());
        setAllUsers(StorageService.getUsers());
        setGuestVisits(StorageService.getGuestVisits());
        setOfficialLetters(StorageService.getOfficialLetters());
        setIncomingLetters(StorageService.getIncomingLetters());
        setAgendas(StorageService.getAgendas());
        setPublicServices(StorageService.getPublicServices());
        setComplaints(StorageService.getComplaints());
        setPartners(StorageService.getPartners());
        setPublications(StorageService.getPublications());
        setNotifications(StorageService.getNotifications());
        setCurrentView('dashboard');

        Swal.fire({
          title: 'Database Direset!',
          text: 'Data awal resmi SD Islam Imama telah dimuat ulang.',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false
        });
      }
    });
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        schoolIdentity={schoolIdentity}
        allUsers={allUsers}
        onLoginSuccess={handleLogin}
        onOpenPublicGuestBook={() => {
          const guestUser = allUsers.find(u => u.role === 'tamu') || allUsers[0];
          handleLogin(guestUser);
          setCurrentView('buku_tamu_publik');
        }}
      />
    );
  }

  // Active visitors count
  const activeVisitorsCount = guestVisits.filter(v => v.status === 'berkunjung').length;
  const pendingApprovalCount = officialLetters.filter(l => l.status === 'menunggu_persetujuan').length;
  const pendingDispositionsCount = incomingLetters.flatMap(l => l.dispositions || []).filter(d => d.status !== 'selesai').length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'menunggu' || c.status === 'diproses').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Professional Navbar */}
      <Navbar
        currentUser={currentUser}
        schoolIdentity={schoolIdentity}
        notifications={notifications}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        onNavigate={setCurrentView}
        activeVisitorsCount={activeVisitorsCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Role-Aware Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            if (v === 'buat_surat') setLetterToEdit(null);
            setCurrentView(v);
          }}
          userRole={currentUser.role}
          pendingApprovalCount={pendingApprovalCount}
          activeVisitorsCount={activeVisitorsCount}
          pendingDispositionsCount={pendingDispositionsCount}
          pendingComplaintsCount={pendingComplaintsCount}
          onResetDatabase={handleResetDatabase}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {currentView === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              schoolIdentity={schoolIdentity}
              guestVisits={guestVisits}
              officialLetters={officialLetters}
              incomingLetters={incomingLetters}
              agendas={agendas}
              complaints={complaints}
              publicServices={publicServices}
              onNavigate={(v) => {
                if (v === 'buat_surat') setLetterToEdit(null);
                setCurrentView(v);
              }}
              onCheckOutGuest={handleCheckOutGuest}
            />
          )}

          {currentView === 'buku_tamu_publik' && (
            <PublicGuestBookView
              schoolIdentity={schoolIdentity}
              onRegisterVisit={handleRegisterVisit}
              onNavigateToManagement={() => setCurrentView('kelola_tamu')}
            />
          )}

          {currentView === 'kelola_tamu' && (
            <GuestManagementView
              schoolIdentity={schoolIdentity}
              guestVisits={guestVisits}
              onCheckOutGuest={handleCheckOutGuest}
              onDeleteGuest={handleDeleteGuest}
              onNavigateToPublicForm={() => setCurrentView('buku_tamu_publik')}
            />
          )}

          {currentView === 'buat_surat' && (
            <LetterGeneratorView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              onSaveLetter={handleSaveLetter}
              onSubmitForApproval={handleSubmitForApproval}
              existingLetterToEdit={letterToEdit}
            />
          )}

          {currentView === 'surat_keluar' && (
            <OutgoingLettersView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              officialLetters={officialLetters}
              onNavigateToCreate={() => {
                setLetterToEdit(null);
                setCurrentView('buat_surat');
              }}
              onEditLetter={handleEditLetter}
              onDeleteLetter={handleDeleteLetter}
            />
          )}

          {currentView === 'persetujuan_surat' && (
            <LetterApprovalView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              officialLetters={officialLetters}
              onApproveLetter={handleApproveLetter}
              onRejectLetter={handleRejectLetter}
              onRequestRevision={handleRequestRevision}
            />
          )}

          {currentView === 'surat_masuk' && (
            <IncomingLetterView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              incomingLetters={incomingLetters}
              onSaveIncomingLetter={handleSaveIncomingLetter}
              onDeleteIncomingLetter={handleDeleteIncomingLetter}
            />
          )}

          {currentView === 'verifikasi_surat' && (
            <LetterVerificationView
              schoolIdentity={schoolIdentity}
              officialLetters={officialLetters}
            />
          )}

          {currentView === 'pelayanan_publik' && (
            <PublicServiceView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              tickets={publicServices}
              onSaveTicket={handleSavePublicService}
            />
          )}

          {currentView === 'pengaduan' && (
            <ComplaintView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              complaints={complaints}
              onSaveComplaint={handleSaveComplaint}
            />
          )}

          {currentView === 'mitra_kerjasama' && (
            <PartnersView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              partners={partners}
              onSavePartner={handleSavePartner}
              onDeletePartner={handleDeletePartner}
            />
          )}

          {currentView === 'publikasi' && (
            <PublicationView
              schoolIdentity={schoolIdentity}
              currentUser={currentUser}
              publications={publications}
              onSavePublication={handleSavePublication}
              onDeletePublication={handleDeletePublication}
            />
          )}

          {currentView === 'agenda' && (
            <HumasAgendaView
              schoolIdentity={schoolIdentity}
              agendas={agendas}
              onSaveAgenda={handleSaveAgenda}
              onDeleteAgenda={handleDeleteAgenda}
            />
          )}

          {currentView === 'asisten_ai' && (
            <AiAssistantView
              schoolIdentity={schoolIdentity}
              onNavigateToLetterGenerator={() => setCurrentView('buat_surat')}
            />
          )}

          {currentView === 'profil_sekolah' && (
            <SchoolProfileView
              schoolIdentity={schoolIdentity}
              onSaveIdentity={handleSaveSchoolIdentity}
            />
          )}

          {currentView === 'kelola_pengguna' && (
            <UserManagementView
              allUsers={allUsers}
              onSaveUser={handleSaveUser}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </main>
      </div>
    </div>
  );
}
