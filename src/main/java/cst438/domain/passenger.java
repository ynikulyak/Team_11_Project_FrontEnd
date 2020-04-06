package cst438.domain;

import javax.persistence.*;

@Entity
@Table(name = "passenger")
public class passenger {
	
	@Column(name= "idPassenger")
	private int idPassenger;
	
	@Column(name = "firstName")
	private String firstName;
	
	@Column(name = "lastName")
	private String lastName;
	
	@Column(name = "email")
	private String email;
	
	@Column(name = "Login_idAccount")
	private int loginIdAccount;
	
}
