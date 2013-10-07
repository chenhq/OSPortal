class CreateOsUsers < ActiveRecord::Migration
  def change
    create_table :os_users do |t|
      t.string :name
      t.string :password
      t.string :tenant_id
      t.integer :user_id

      t.timestamps
    end
  end
end
