const firebaseConfig = {
  apiKey: "AIzaSyAXZKdkx72F2GvM7qaynr5r9agAMAiVX2s",
  authDomain: "commonpjt-fd9ed.firebaseapp.com",
  databaseURL: "https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "commonpjt-fd9ed",
  storageBucket: "commonpjt-fd9ed.firebasestorage.app",
  messagingSenderId: "653463134970",
  appId: "1:653463134970:web:8301b6f3a2bde8da201f43"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 전체 데이터 로딩 함수
function loadData() {
  db.ref().once('value')
    .then(snapshot => {
      const data = snapshot.val();
      const display = document.getElementById('dataDisplay');

      if (!data) {
        display.innerHTML = '(저장된 데이터가 없습니다)';
        return;
      }

      let html = '';

      for (const name in data) {
        const user = data[name];

        let tableHTML = `
          <div class="user-section">
            <h3>${name}님 데이터</h3>
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>키</th>
                  <th>값</th>
                </tr>
              </thead>
              <tbody>
        `;

        for (const section in user) {
          const sectionData = user[section];
          let firstSectionRow = true;

          if (typeof sectionData === 'object') {
            for (const key in sectionData) {
              tableHTML += `
                <tr>
                  <td>${firstSectionRow ? section : ''}</td>
                  <td>${key}</td>
                  <td>${JSON.stringify(sectionData[key])}</td>
                </tr>
              `;
              firstSectionRow = false;
            }
          } else {
            tableHTML += `
              <tr>
                <td>${section}</td>
                <td>-</td>
                <td>${sectionData}</td>
              </tr>
            `;
          }
        }

        tableHTML += `</tbody></table></div>`;
        html += tableHTML;
      }

      display.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('dataDisplay').innerHTML = '(데이터 불러오기 실패)';
    });
}

// 입력 버튼
document.getElementById('submitBtn').addEventListener('click', () => {
  const name = "이혜령";
  const studentId = "2024800014";

  // 이름 아래 info/학번 저장 (current_user 저장 안 함)
  db.ref(name + '/info').set({ 학번: studentId })
    .then(() => {
      console.log(`이름(${name}), 학번(${studentId}) 입력 완료`);
      alert('입력됐습니다!');
      document.getElementById('status').textContent = `${name}님 정보가 저장되었습니다.`;
    })
    .catch((error) => {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    });
});

// 업데이트 버튼
document.getElementById('updateBtn').addEventListener('click', () => {
  const name = "이혜령";  // 입력창 없이 고정된 이름 사용

  const sensehatRef = db.ref(`${name}/sensehat`);
  sensehatRef.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        alert('업데이트가 완료되었습니다!');
        console.log(`[업데이트 성공] ${name}의 센서 데이터:`, data);
      } else {
        alert('아직 센서 데이터가 업로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        console.warn(`[업데이트 실패] ${name} 경로에 센서 데이터가 없음`);
      }
    })
    .catch((error) => {
      console.error('업데이트 확인 중 오류:', error);
      alert('업데이트 상태를 확인하는 중 오류가 발생했습니다.');
    });
});

// 삭제 버튼
document.getElementById('deleteBtn').addEventListener('click', () => {
  const name = "이혜령";  // 입력창 없이 고정된 이름 사용

  db.ref(name).remove()
    .then(() => {
      console.log(`${name} 데이터가 삭제되었습니다.`);
      alert('데이터가 제거되었습니다!');
      document.getElementById('status').textContent = `${name}님의 데이터가 삭제되었습니다.`;
    })
    .catch((error) => {
      console.error(error);
      alert('삭제 중 오류가 발생했습니다.');
    });
});

// 메세지 입력 처리
/* customSubmitBtn.addEventListener('click', () => {
  const message = inputText.value.trim();

  if (message) {
    const messageRef = firebase.database().ref('message');
    messageRef.set(message)
      .then(() => {
        document.getElementById('status').textContent = '메세지가 저장되었습니다.';
        inputText.value = '';
      })
      .catch((error) => {
        document.getElementById('status').textContent = '저장 실패: ' + error.message;
      });
  } else {
    document.getElementById('status').textContent = '메세지를 입력해주세요.';
  }
}); */

// 초기 로딩 시 전체 데이터 표시
window.addEventListener('load', loadData);
