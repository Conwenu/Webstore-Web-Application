class UserService {
  getCurrentUser(property: string) {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr)[property];

    return null;
  }
}

export default new UserService();
