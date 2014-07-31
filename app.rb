require 'sinatra'
require 'sinatra/activerecord'

db = URI.parse(ENV['DATABASE_URL'] || 'postgres://Jane:pass@localhost/players')

ActiveRecord::Base.establish_connection(
 :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
 :host     => db.host,
 :username => db.user,
 :password => db.password,
 :database => db.path[1..-1],
 :encoding => 'utf8'
)

class Player < ActiveRecord::Base
end

get "/" do 
	@players = Player.order(score: :desc).limit(10)

	erb :index
end

post "/add" do
	if params[:name] == ""
		params[:name] = "USER"
	end

	Player.create(
		name: params[:name],
		score: params[:score]
	)

	redirect "/"
end